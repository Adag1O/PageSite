import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: z.object({
    name: z.string(),
    category: z.string(),
    price: z.string(),
    priceNumber: z.number().optional(),
    tag: z.string().optional(),
    tagColor: z.string().optional(),
    description: z.string(),
    longDescription: z.string().optional(),
    specs: z.array(z.string()),
    features: z.array(z.object({
      title: z.string(),
      description: z.string(),
      icon: z.string().optional(),
    })).optional(),
    images: z.array(z.string()).optional(),
    video: z.string().optional(),
    inStock: z.boolean().default(true),
    gradient: z.string().default('from-blue-500 to-indigo-600'),
    icon: z.string().optional(),
    related: z.array(z.string()).optional(),
    purchasable: z.boolean().default(true),
  }),
});

const demos = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/demos' }),
  schema: z.object({
    name: z.string(),
    path: z.string(),
    description: z.string(),
    category: z.string(),
    icon: z.string(),
    active: z.boolean().default(true),
    order: z.number().default(0),
    theme: z.object({
      bg: z.string(),
      text: z.string(),
      border: z.string(),
      hoverText: z.string(),
    }),
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/testimonials' }),
  schema: z.object({
    name: z.string(),
    role: z.string().optional(),
    company: z.string().optional(),
    text: z.string(),
    rating: z.number().min(1).max(5).default(5),
    avatar: z.string().optional(),
    approved: z.boolean().default(false),
    date: z.string().optional(),
    project: z.string().optional(),
  }),
});

const pricing = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/pricing' }),
  schema: z.object({
    category: z.string(),
    order: z.number().default(0),
    plans: z.array(z.object({
      title: z.string(),
      description: z.string(),
      price: z.string(),
      period: z.string().default('proyecto único'),
      gradient: z.string(),
      icon: z.string(),
      isPopular: z.boolean().default(false),
      features: z.array(z.string()),
      notIncluded: z.array(z.string()).default([]),
    })),
  }),
});

const settings = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/settings' }),
  schema: z.object({
    siteName: z.string().optional(),
    whatsapp: z.string().optional(),
    email: z.string().optional(),
    address: z.string().optional(),
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    github: z.string().optional(),
  }),
});

export const collections = { products, demos, testimonials, pricing, settings };
