import { BrowserPool } from '../browser/pool';
import { CrawlerEngine } from '../crawler/crawler';
import { ScraperConfig } from './config';
import { logger } from './logger';
import { PluginManager } from '../plugins/manager';
import { JsonExporter, CsvExporter } from '../storage';
import { FrameworkDetector } from '../detectors/framework';
import { PdfDownloader } from '../downloaders/pdf';

export class ScrapexEngine {
  private config: ScraperConfig;
  private pool: BrowserPool;
  private pluginManager: PluginManager;

  constructor(config: ScraperConfig) {
    this.config = config;
    this.pool = new BrowserPool(config);
    this.pluginManager = new PluginManager();
  }

  public async run(url: string): Promise<void> {
    try {
      logger.info('Initializing Engine...');
      await this.pool.initialize();

      const crawler = new CrawlerEngine(url, this.config, this.pool);

      const results = await crawler.start(async (page, depth) => {
        const rawHtml = await page.getHtml();
        const framework = FrameworkDetector.detect(rawHtml);
        
        const plugin = this.pluginManager.getPluginFor(page.getRawPage().url(), rawHtml, framework);
        logger.debug(`Selected plugin: ${plugin.name} for ${page.getRawPage().url()}`);
        
        const data = await plugin.extract(page, page.getRawPage().url());

        // Process PDFs if enabled
        if (this.config.downloadPDF && data.pdfs && data.pdfs.length > 0) {
          logger.info(`Found ${data.pdfs.length} PDFs, downloading...`);
          for (const pdfUrl of data.pdfs) {
            const pdfText = await PdfDownloader.downloadAndExtract(pdfUrl);
            if (pdfText) {
              data.paragraphs.push(`[PDF Content from ${pdfUrl}]: ${pdfText.substring(0, 1000)}...`);
            }
          }
        }

        return data;
      });

      logger.info(`Scraping completed. Extracted ${results.length} pages.`);

      // Export
      if (results.length > 0) {
        const jsonExporter = new JsonExporter();
        await jsonExporter.export(results, this.config.output);
        
        const csvExporter = new CsvExporter();
        await csvExporter.export(results, this.config.output);
      }

    } catch (error: any) {
      logger.error({ error: error.message }, 'Engine error');
    } finally {
      await this.pool.close();
    }
  }
}
