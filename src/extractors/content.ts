import * as cheerio from 'cheerio';
import { TextCleaner } from '../cleaners/text';

export class ContentExtractor {
  public static extractHeadings($: cheerio.CheerioAPI): string[] {
    const headings: string[] = [];
    $('h1, h2, h3, h4, h5, h6').each((_, el) => {
      const text = TextCleaner.normalize($(el).text());
      if (text) headings.push(text);
    });
    return headings;
  }

  public static extractParagraphs($: cheerio.CheerioAPI): string[] {
    const paragraphs: string[] = [];
    $('p').each((_, el) => {
      const text = TextCleaner.normalize($(el).text());
      if (text) paragraphs.push(text);
    });
    return paragraphs;
  }

  public static extractCards($: cheerio.CheerioAPI): Record<string, string>[] {
    const cards: Record<string, string>[] = [];
    // Basic heuristic: look for typical card classes or semantic articles
    const cardElements = $('.card, [class*="card"], [class*="item"], article');
    
    cardElements.each((_, el) => {
      const cardObj: Record<string, string> = {};
      const $el = $(el);
      
      const title = $el.find('h1, h2, h3, h4, .title').first().text();
      const content = $el.find('p, .description, .content').first().text();
      
      if (title || content) {
        if (title) cardObj['title'] = TextCleaner.normalize(title);
        if (content) cardObj['content'] = TextCleaner.normalize(content);
        cards.push(cardObj);
      }
    });

    return cards;
  }
}
