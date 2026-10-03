import { Command } from 'commander';
import { logger } from '../core/logger';
import { ScraperConfigSchema } from '../core/config';
import dotenv from 'dotenv';

dotenv.config();

export const cli = new Command();

cli
  .name('scrapex')
  .description('Enterprise Universal Web Scraping Engine')
  .version('1.0.0');

cli
  .command('scrape <url>')
  .description('Scrape a single URL or start crawling from it')
  .option('-d, --depth <number>', 'Maximum crawl depth', '1')
  .option('-t, --timeout <number>', 'Timeout in ms', '30000')
  .option('-h, --headless <boolean>', 'Run in headless mode', 'true')
  .option('-p, --download-pdf <boolean>', 'Download and parse PDFs', 'false')
  .option('-o, --output <string>', 'Output directory', './output')
  .option('-r, --rate-limit <number>', 'Rate limit in ms', '1000')
  .action(async (url, options) => {
    try {
      logger.info(`Starting Scrapex for URL: ${url}`);
      
      const configRaw = {
        depth: parseInt(options.depth, 10),
        timeout: parseInt(options.timeout, 10),
        headless: options.headless === 'true',
        downloadPDF: options.downloadPdf === 'true',
        output: options.output,
        rateLimit: parseInt(options.rateLimit, 10),
        proxy: process.env.PROXY_URL,
        userAgent: process.env.USER_AGENT,
      };

      const config = ScraperConfigSchema.parse(configRaw);
      logger.info({ config }, 'Parsed Configuration');

      const { ScrapexEngine } = await import('../core/engine');
      const engine = new ScrapexEngine(config);
      await engine.run(url);
      
    } catch (error: any) {
      logger.error(`Error during execution: ${error.message}`);
      process.exit(1);
    }
  });

cli
  .command('extract <url>')
  .description('Extract specific structured data without deep crawling')
  .action((url) => {
    logger.info(`Extracting data from: ${url}`);
    // TODO
  });

cli
  .command('pdf <url>')
  .description('Extract text from a remote PDF')
  .action((url) => {
    logger.info(`Extracting PDF from: ${url}`);
    // TODO
  });
