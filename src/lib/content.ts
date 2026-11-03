import { getCollection, type CollectionEntry } from 'astro:content';

export const articleCollections = ['learning', 'algorithms', 'practices', 'thoughts'] as const;
export type ArticleCollection = (typeof articleCollections)[number];

/** Public lists, statistics and getStaticPaths must use this helper, even in dev. */
export async function getPublishedCollection<C extends ArticleCollection>(collection: C) {
  const entries = await getCollection(collection);
  return entries
    .filter((entry) => !entry.data.draft)
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()
      || a.id.localeCompare(b.id));
}

/** Detail lookup applies the same publication rule as lists. */
export async function getPublishedEntry<C extends ArticleCollection>(collection: C, id: string) {
  const entries = await getPublishedCollection(collection);
  return entries.find((entry) => entry.id === id);
}

export type Article = CollectionEntry<ArticleCollection>;
