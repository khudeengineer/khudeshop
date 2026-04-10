import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const products = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/products" }),
  schema: z.object({
    title: z.string(),
    price: z.number(),
    image: z.string(),
    category: z.string(),
    isOffer: z.boolean(),
    isTop: z.boolean(),
    dateAdded: z.coerce.date(),
  }),
});

export const collections = { products };
