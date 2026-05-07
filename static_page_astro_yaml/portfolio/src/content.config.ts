import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import {z} from 'zod'

const portfolios = defineCollection({
  loader: glob({
    base: './src/content/portfolios',
    pattern: '**/!(*README).md', // ✅ exclude README
  }),

  schema: z.object({
    title: z.string(),
    author: z.string(),
    date: z.coerce.date().optional(),
    position: z.string().optional(),
    avatar: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email({message: "Please enter a valid email address",}).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const projects = defineCollection({
  loader: glob({
    base: './src/content',
    pattern: 'projects.yaml',
  }),
});

const profiles = defineCollection({
  loader: glob({
    base: './src/content',
    pattern: 'profiles.yaml',
  }),
});

export const collections = {
  portfolios,
  projects,
  profiles,
};

