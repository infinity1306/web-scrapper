export interface ExtractedData {
  url: string;
  title: string;
  description: string;
  framework: string;
  metadata: Record<string, string>;
  headings: string[];
  paragraphs: string[];
  tables: Record<string, any>[][];
  cards: Record<string, string>[];
  forms: Record<string, any>[];
  images: { url: string; alt: string; width?: number; height?: number }[];
  links: { text: string; href: string; type: 'internal' | 'external' }[];
  pdfs: string[];
  downloads: string[];
  emails: string[];
  phones: string[];
  address: string[];
  schema: Record<string, any>;
}

export interface CrawlQueueItem {
  url: string;
  depth: number;
}
