import { BrowserPool } from '../browser/pool';
import { ScraperPage } from '../browser/page';
import { CrawlQueue } from './queue';
import { ScraperConfig } from '../core/config';
import { logger } from '../core/logger';
import { ExtractedData } from '../core/types';

export class CrawlerEngine {
  private queue: CrawlQueue;
  private pool: BrowserPool;
  private config: ScraperConfig;
  private baseUrl: URL;

  constructor(startUrl: string, config: ScraperConfig, pool: BrowserPool) {
    this.config = config;
    this.pool = pool;
    this.queue = new CrawlQueue();
    this.baseUrl = new URL(startUrl);

    this.queue.enqueue({ url: startUrl, depth: 0 });
  }

  public async start(extractCallback: (page: ScraperPage, currentDepth: number) => Promise<ExtractedData>): Promise<ExtractedData[]> {
    const results: ExtractedData[] = [];
    
    while (!this.queue.isEmpty()) {
      const item = this.queue.dequeue();
      if (!item) break;

      if (item.depth > this.config.depth) {
        logger.debug(`Skipping ${item.url} (Depth ${item.depth} > Max ${this.config.depth})`);
        continue;
      }

      logger.info(`Crawling: ${item.url} (Depth: ${item.depth})`);

      try {
        const context = this.pool.getContext();
        const playwrightPage = await context.newPage();
        const page = new ScraperPage(playwrightPage, this.config);

        await page.navigate(item.url);
        
        const data = await extractCallback(page, item.depth);
        results.push(data);

        // Auto-enqueue internal links if depth allows
        if (item.depth < this.config.depth) {
          const internalLinks = data.links.filter(l => l.type === 'internal').map(l => l.href);
          for (const link of internalLinks) {
            try {
              const fullUrl = new URL(link, this.baseUrl).href;
              // Only enqueue if it belongs to the same origin to avoid escaping the domain
              if (new URL(fullUrl).origin === this.baseUrl.origin) {
                this.queue.enqueue({ url: fullUrl, depth: item.depth + 1 });
              }
            } catch (e) {
              // invalid url
            }
          }
        }

        await page.close();
      } catch (error: any) {
        logger.error({ error: error.message }, `Error crawling ${item.url}`);
      }
    }

    return results;
  }
}
