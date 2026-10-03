import * as cheerio from 'cheerio';
import { ScraperPlugin } from './base';
import { ScraperPage } from '../browser/page';
import { ExtractedData } from '../core/types';
import { FrameworkDetector } from '../detectors/framework';
import { HtmlCleaner } from '../cleaners/html';
import { MetadataExtractor, ContentExtractor, TableExtractor, LinkExtractor, ImageExtractor, FormExtractor, SchemaExtractor } from '../extractors';

export class GenericPlugin extends ScraperPlugin {
  public name = 'GenericPlugin';

  public canHandle(): boolean {
    // Fallback plugin always returns true
    return true;
  }

  public async extract(page: ScraperPage, url: string): Promise<ExtractedData> {
    const rawHtml = await page.getHtml();
    const framework = FrameworkDetector.detect(rawHtml);
    
    // Clean DOM
    const $ = HtmlCleaner.clean(rawHtml);

    // Extract
    const metadata = MetadataExtractor.extract($);
    const title = MetadataExtractor.extractTitle($);
    const description = MetadataExtractor.extractDescription($);
    
    const headings = ContentExtractor.extractHeadings($);
    const paragraphs = ContentExtractor.extractParagraphs($);
    const cards = ContentExtractor.extractCards($);
    
    const tables = TableExtractor.extract($);
    
    const { links, pdfs, downloads, emails, phones } = LinkExtractor.extract($, url);
    const images = ImageExtractor.extract($, url);
    const forms = FormExtractor.extract($);
    
    const schema = SchemaExtractor.extract($);

    return {
      url,
      title,
      description,
      framework,
      metadata,
      headings,
      paragraphs,
      tables,
      cards,
      forms,
      images,
      links,
      pdfs,
      downloads,
      emails,
      phones,
      address: [], // Placeholder, schema handles state/location
      schema,
    };
  }
}
