import { Page } from 'playwright';
import * as cheerio from 'cheerio';
import { logger } from '../core/logger';

export class PaginationDetector {
  public static async hasNextPage(html: string): Promise<string | null> {
    const $ = cheerio.load(html);
    let nextUrl: string | null = null;

    const commonSelectors = [
      'a.next', 'a[rel="next"]', 'a:contains("Next")', 'a:contains(">>")',
      'a:contains(">")', '.pagination-next a', '.nav-next a'
    ];

    for (const selector of commonSelectors) {
      const el = $(selector);
      if (el.length > 0 && el.attr('href') && el.attr('href') !== '#') {
        nextUrl = el.attr('href') || null;
        break;
      }
    }

    return nextUrl;
  }

  public static async triggerInfiniteScroll(page: Page): Promise<boolean> {
    logger.debug('Attempting infinite scroll detection...');
    let previousHeight = await page.evaluate(() => document.body.scrollHeight);
    
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000); // Wait for potential load
    
    let currentHeight = await page.evaluate(() => document.body.scrollHeight);
    
    if (currentHeight > previousHeight) {
      logger.info('Infinite scroll detected and triggered.');
      return true;
    }
    return false;
  }

  public static async clickLoadMore(page: Page): Promise<boolean> {
    const commonButtons = [
      'button:has-text("Load More")',
      'button:has-text("Show More")',
      'a:has-text("Load More")'
    ];

    for (const selector of commonButtons) {
      const el = page.locator(selector).first();
      if (await el.isVisible()) {
        await el.click();
        await page.waitForTimeout(2000);
        logger.info(`Clicked Load More button: ${selector}`);
        return true;
      }
    }
    return false;
  }
}
