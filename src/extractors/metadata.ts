import * as cheerio from 'cheerio';
import { TextCleaner } from '../cleaners/text';

export class MetadataExtractor {
  public static extract($: cheerio.CheerioAPI): Record<string, string> {
    const metadata: Record<string, string> = {};

    $('meta').each((_, el) => {
      const name = $(el).attr('name') || $(el).attr('property');
      const content = $(el).attr('content');
      
      if (name && content) {
        metadata[name] = TextCleaner.normalize(content);
      }
    });

    return metadata;
  }

  public static extractTitle($: cheerio.CheerioAPI): string {
    return TextCleaner.normalize($('title').text() || $('h1').first().text());
  }

  public static extractDescription($: cheerio.CheerioAPI): string {
    return TextCleaner.normalize($('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '');
  }
}
