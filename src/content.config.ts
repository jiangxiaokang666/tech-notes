import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import {
  learningSchema,
  algorithmSchema,
  practiceSchema,
  thoughtSchema,
} from './lib/content-schemas';

// Load and validate drafts too: filtering belongs in the public query layer.
export const collections = {
  learning: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/learning' }),
    schema: learningSchema,
  }),
  algorithms: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/algorithms' }),
    schema: algorithmSchema,
  }),
  practices: defineCollection({
    // Reserved for phase two; enable glob loading when articles are added.
    loader: async () => [],
    schema: practiceSchema,
  }),
  thoughts: defineCollection({
    // Reserved for phase two; enable glob loading when articles are added.
    loader: async () => [],
    schema: thoughtSchema,
  }),
};
