import { getPublishedCollection } from './content';

export async function getLearningSeries() {
  const chapters = await getPublishedCollection('learning');
  const ids = [...new Set(chapters.map((entry) => entry.data.series))];
  return ids.map((id) => {
    const entries = chapters.filter((entry) => entry.data.series === id)
      .sort((a, b) => a.data.seriesOrder - b.data.seriesOrder);
    const first = entries[0];
    const orders = entries.map((entry) => entry.data.seriesOrder);
    if (new Set(orders).size !== orders.length) {
      throw new Error(`专题 ${id} 的 seriesOrder 重复，请检查：${entries.map((entry) => entry.filePath).join(', ')}`);
    }
    if (entries.some((entry) => entry.data.seriesTitle !== first.data.seriesTitle || entry.data.category !== first.data.category)) {
      throw new Error(`专题 ${id} 的 seriesTitle 或 category 不一致`);
    }
    return {
      id, title: first.data.seriesTitle, category: first.data.category,
      description: first.data.seriesDescription ?? '按章节记录学习过程，逐步整理知识。',
      chapters: entries,
    };
  });
}
