import * as cheerio from 'cheerio';
import { TextCleaner } from '../cleaners/text';

export class ImageExtractor {
  public static extract($: cheerio.CheerioAPI, baseUrl: string) {
    const images: { url: string; alt: string; width?: number; height?: number }[] = [];

    $('img[src]').each((_, el) => {
      const src = $(el).attr('src')!;
      if (src.startsWith('data:image')) return; // skip base64

      const alt = TextCleaner.normalize($(el).attr('alt') || '');
      const width = parseInt($(el).attr('width') || '0', 10);
      const height = parseInt($(el).attr('height') || '0', 10);

      const url = TextCleaner.normalizeUrl(src, baseUrl);

      images.push({
        url,
        alt,
        ...(width > 0 && { width }),
        ...(height > 0 && { height }),
      });
    });

    return images;
  }
}
