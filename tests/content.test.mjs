import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { writeFileSync, unlinkSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';
import {
  learningSchema, algorithmSchema, practiceSchema, thoughtSchema,
} from '../src/lib/content-schemas.ts';

const common = {
  title: '示例', description: '示例说明', pubDate: '2026-11-03', category: '测试',
};
const learning = {
  ...common, type: 'learning', series: 'cpp-object-model', seriesTitle: '示例专题', seriesOrder: 1,
};
const algorithm = {
  ...common, type: 'algorithm', difficulty: 'Easy', source: '示例', sourceUrl: 'https://example.com/problem',
};

test('四种文章类型、日期转换和默认字段', () => {
  for (const [schema, data] of [
    [learningSchema, learning], [algorithmSchema, algorithm],
    [practiceSchema, { ...common, type: 'practice' }],
    [thoughtSchema, { ...common, type: 'thought' }],
  ]) {
    const result = schema.parse(data);
    assert.deepEqual(result.tags, []);
    assert.equal(result.draft, false);
    assert.ok(result.pubDate instanceof Date);
  }
  assert.equal(algorithmSchema.parse(algorithm).language, 'cpp');
});

test('必填文本、日期和布尔类型校验', () => {
  for (const key of ['title', 'description', 'pubDate', 'category']) {
    const data = { ...learning };
    delete data[key];
    assert.equal(learningSchema.safeParse(data).success, false, key);
  }
  for (const value of ['', '  ', null, 123]) {
    assert.equal(learningSchema.safeParse({ ...learning, title: value }).success, false);
  }
  for (const value of [null, true, 123, 'invalid-date', '']) {
    assert.equal(learningSchema.safeParse({ ...learning, pubDate: value }).success, false);
  }
  assert.equal(learningSchema.safeParse({ ...learning, draft: 'false' }).success, false);
  assert.equal(learningSchema.safeParse({ ...learning, tags: 'C++' }).success, false);
  assert.equal(learningSchema.safeParse({ ...learning, type: 'thought' }).success, false);
});

test('算法难度必填且限制枚举，原题链接限制协议', () => {
  for (const difficulty of ['Easy', 'Medium', 'Hard']) {
    assert.ok(algorithmSchema.safeParse({ ...algorithm, difficulty }).success);
  }
  for (const difficulty of [undefined, '', 'easy', 'Expert']) {
    assert.equal(algorithmSchema.safeParse({ ...algorithm, difficulty }).success, false);
  }
  for (const sourceUrl of ['invalid', 'javascript:alert(1)', 'ftp://example.com']) {
    assert.equal(algorithmSchema.safeParse({ ...algorithm, sourceUrl }).success, false);
  }
});

test('专题序号必须为正整数，专题标识必须为英文 slug', () => {
  for (const seriesOrder of [undefined, 0, -1, 1.5, '2']) {
    assert.equal(learningSchema.safeParse({ ...learning, seriesOrder }).success, false);
  }
  assert.equal(learningSchema.safeParse({ ...learning, series: '中文专题' }).success, false);
});

function build() {
  const result = spawnSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build'], {
    cwd: resolve(import.meta.dirname, '..'),
    encoding: 'utf8',
    env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1', NO_COLOR: '1' },
    timeout: 60000,
  });
  if (result.error) throw result.error;
  return { status: result.status, output: result.stdout + result.stderr };
}

test('实际 glob 加载、Markdown 渲染、公开查询及错误内容构建失败', () => {
  // Temporary test-only route; never retained as a business page.
  const token = randomUUID();
  const route = resolve('src/pages', `__content-check-${token}.json.ts`);
  const fixture = resolve('src/content/algorithms', `invalid-${token}.md`);
  let routeCreated = false;
  let fixtureCreated = false;
  try {
    writeFileSync(route, `
import assert from 'node:assert/strict';
import { getCollection } from 'astro:content';
import { articleCollections, getPublishedCollection, getPublishedEntry } from '../lib/content';
export async function GET() {
  for (const name of articleCollections) {
    const all = await getCollection(name);
    const published = await getPublishedCollection(name);
    assert.ok(all.length > 0);
    assert.deepEqual(published.map(e => e.id).sort(), all.filter(e => !e.data.draft).map(e => e.id).sort());
    for (const entry of published) {
      assert.ok(entry.data.pubDate instanceof Date);
      assert.ok(entry.rendered?.html.includes('<h2'));
      assert.ok(entry.body?.trim().length > 0);
    }
  }
  const thoughts = await getCollection('thoughts');
  const draft = thoughts.find(e => e.id === 'draft-example');
  assert.ok(draft?.data.draft);
  assert.equal(await getPublishedEntry('thoughts', 'draft-example'), undefined);
  assert.equal(await getPublishedEntry('thoughts', 'missing'), undefined);
  assert.ok(await getPublishedEntry('thoughts', 'engineering-tradeoffs'));
  const chapters = (await getPublishedCollection('learning')).filter(e => e.data.series === 'cpp-object-model');
  assert.deepEqual(chapters.map(e => e.data.seriesOrder).sort((a,b) => a-b), [1, 2]);
  assert.ok(chapters.some(e => e.rendered?.html.includes('<table>')));
  assert.ok(chapters.some(e => e.rendered?.html.includes('<pre')));
  const imported = (await getPublishedCollection('learning')).filter(e => e.data.series === 'nju-generative-software-engineering');
  assert.deepEqual(imported.map(e => e.data.seriesOrder).sort((a,b) => a-b), [1,2,3,4,5,6,7,8]);
  assert.ok(imported.every(e => e.data.sourceUrl?.startsWith('https://github.com/jiangxiaokang666/nju-gse-notes/blob/')));
  return Response.json({ ok: true });
}
`, { flag: 'wx' });
    routeCreated = true;
    const valid = build();
    assert.equal(valid.status, 0, valid.output);

    // Even an unpublished invalid article must fail the normal build.
    writeFileSync(fixture, `---\ntitle: 错误示例\ndescription: 错误示例\npubDate: 2026-11-03\ncategory: 测试\ntype: algorithm\nsource: 示例\nsourceUrl: https://example.com\ndraft: true\n---\n示例内容\n`, { flag: 'wx' });
    fixtureCreated = true;
    const invalid = build();
    assert.notEqual(invalid.status, 0);
    assert.match(invalid.output, /difficulty/);
    assert.ok(invalid.output.includes(`invalid-${token}.md`), invalid.output);
  } finally {
    if (routeCreated) unlinkSync(route);
    if (fixtureCreated) unlinkSync(fixture);
  }
});
