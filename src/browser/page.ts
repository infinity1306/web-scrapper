import { Page as PlaywrightPage } from 'playwright';
import { logger } from '../core/logger';
import { NetworkError } from '../core/errors';
import { ScraperConfig } from '../core/config';

export class ScraperPage {
  private page: PlaywrightPage;
  private config: ScraperConfig;

  constructor(page: PlaywrightPage, config: ScraperConfig) {
    this.page = page;
    this.config = config;
  }

  public async navigate(url: string): Promise<void> {
    logger.debug(`Navigating to ${url}`);
    let attempt = 0;
    const maxRetries = 3;

    while (attempt < maxRetries) {
      try {
        const response = await this.page.goto(url, {
          waitUntil: 'networkidle',
          timeout: this.config.timeout,
        });

        if (!response) {
          throw new NetworkError('No response received', url);
        }

        const status = response.status();
        if (status >= 400) {
          logger.warn(`Received HTTP ${status} for ${url}`);
          if (status === 403 || status === 429 || status === 503) {
            // Might be anti-bot or rate limited, could trigger delay/retry
            if (attempt === maxRetries - 1) {
              throw new NetworkError(`HTTP Error ${status}`, url, status);
            }
          }
        }
        
        logger.info(`Successfully loaded ${url}`);
        return;
      } catch (error: any) {
        attempt++;
        logger.warn(`Navigation failed for ${url} (Attempt ${attempt}/${maxRetries}): ${error.message}`);
        if (attempt >= maxRetries) {
          throw new NetworkError(`Failed to load page after ${maxRetries} attempts: ${error.message}`, url);
        }
        await new Promise((resolve) => setTimeout(resolve, this.config.rateLimit * attempt)); // exponential backoff
      }
    }
  }

  public async getHtml(): Promise<string> {
    return await this.page.content();
  }

  public async close(): Promise<void> {
    await this.page.close();
  }

  public getRawPage(): PlaywrightPage {
    return this.page;
  }
}
