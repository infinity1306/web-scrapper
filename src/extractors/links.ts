import * as cheerio from 'cheerio';
import { TextCleaner } from '../cleaners/text';

export class LinkExtractor {
  public static extract($: cheerio.CheerioAPI, baseUrl: string) {
    const links: { text: string; href: string; type: 'internal' | 'external' }[] = [];
    const pdfs: string[] = [];
    const downloads: string[] = [];
    const emails: string[] = [];
    const phones: string[] = [];

    const baseOrigin = new URL(baseUrl).origin;

    $('a[href]').each((_, el) => {
      const href = $(el).attr('href')!;
      const text = TextCleaner.normalize($(el).text());
      
      if (href.startsWith('mailto:')) {
        emails.push(href.replace('mailto:', ''));
        return;
      }
      
      if (href.startsWith('tel:')) {
        phones.push(href.replace('tel:', ''));
        return;
      }
      
      if (href.startsWith('javascript:') || href.startsWith('#')) return;

      const normalizedHref = TextCleaner.normalizeUrl(href, baseUrl);
      
      // Categorize
      if (normalizedHref.toLowerCase().endsWith('.pdf')) {
        pdfs.push(normalizedHref);
      } else if (normalizedHref.match(/\.(zip|csv|xlsx|xls|doc|docx)$/i)) {
        downloads.push(normalizedHref);
      } else {
        try {
          const urlObj = new URL(normalizedHref);
          const type = urlObj.origin === baseOrigin ? 'internal' : 'external';
          links.push({ text, href: normalizedHref, type });
        } catch {
          // Invalid URL
        }
      }
    });

    return {
      links: [...new Map(links.map(item => [item.href, item])).values()], // Deduplicate by href
      pdfs: [...new Set(pdfs)],
      downloads: [...new Set(downloads)],
      emails: [...new Set(emails)],
      phones: [...new Set(phones)],
    };
  }
}
