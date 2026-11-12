import { z } from 'astro/zod';

const text = z.string().trim().min(1, '不能为空');
const slug = text.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, '请使用英文小写、数字和连字符');
// Accept YAML dates and date strings, but reject null, numbers and booleans.
const date = z.union([z.string().trim().min(1), z.date()]).pipe(z.coerce.date());

const common = {
  title: text,
  description: text,
  pubDate: date,
  updatedDate: date.optional(),
  category: text,
  tags: z.array(text).default([]),
  draft: z.boolean().default(false),
};

export const learningSchema = z.object({
  ...common,
  type: z.literal('learning'),
  series: slug,
  seriesTitle: text,
  seriesOrder: z.number().int().positive(),
  seriesDescription: text.optional(),
  sourceUrl: z.url({ protocol: /^https?$/ }).optional(),
  sourceRevision: text.optional(),
});

export const algorithmSchema = z.object({
  ...common,
  type: z.literal('algorithm'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  source: text,
  sourceUrl: z.url({ protocol: /^https?$/, error: '原题链接必须是有效的 HTTP 或 HTTPS URL' }),
  language: text.default('cpp'),
  implementation: text.regex(/^[\w-]+\.cpp$/).optional(),
});

export const practiceSchema = z.object({ ...common, type: z.literal('practice') });
export const thoughtSchema = z.object({ ...common, type: z.literal('thought') });
