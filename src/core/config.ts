import { z } from 'zod';

export const ScraperConfigSchema = z.object({
  depth: z.number().min(1).default(1),
  timeout: z.number().min(1000).default(30000),
  headless: z.boolean().default(true),
  downloadPDF: z.boolean().default(false),
  output: z.string().default('./output'),
  rateLimit: z.number().min(0).default(1000), // Delay between requests in ms
  proxy: z.string().optional(),
  userAgent: z.string().optional(),
});

export type ScraperConfig = z.infer<typeof ScraperConfigSchema>;

export const DEFAULT_CONFIG: ScraperConfig = {
  depth: 1,
  timeout: 30000,
  headless: true,
  downloadPDF: false,
  output: './output',
  rateLimit: 1000,
};
