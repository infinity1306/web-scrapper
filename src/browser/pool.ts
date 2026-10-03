import { Browser, BrowserContext, chromium } from 'playwright';
import { logger } from '../core/logger';
import { ScraperConfig } from '../core/config';
import { NetworkError } from '../core/errors';

export class BrowserPool {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private config: ScraperConfig;

  constructor(config: ScraperConfig) {
    this.config = config;
  }

  public async initialize(): Promise<void> {
    if (this.browser) return;

    logger.debug('Initializing Playwright Chromium Browser...');
    try {
      this.browser = await chromium.launch({
        headless: this.config.headless,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
        ],
        proxy: this.config.proxy ? { server: this.config.proxy } : undefined,
      });

      this.context = await this.browser.newContext({
        userAgent: this.config.userAgent,
        viewport: { width: 1920, height: 1080 },
        ignoreHTTPSErrors: true,
      });

      logger.info('Browser initialized successfully.');
    } catch (error: any) {
      logger.error({ error: error.message }, 'Failed to initialize browser pool');
      throw new NetworkError(`Browser initialization failed: ${error.message}`);
    }
  }

  public getContext(): BrowserContext {
    if (!this.context) {
      throw new Error('Browser context not initialized. Call initialize() first.');
    }
    return this.context;
  }

  public async close(): Promise<void> {
    if (this.context) {
      await this.context.close();
      this.context = null;
    }
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
    logger.info('Browser pool closed.');
  }
}
