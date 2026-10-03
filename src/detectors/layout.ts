import * as cheerio from 'cheerio';

export class LayoutDetector {
  public static hasTables($: cheerio.CheerioAPI): boolean {
    return $('table').length > 0;
  }

  public static hasCards($: cheerio.CheerioAPI): boolean {
    return $('.card, [class*="card"], [class*="Grid"], article').length > 0;
  }

  public static hasAccordions($: cheerio.CheerioAPI): boolean {
    return $('.accordion, [data-toggle="collapse"], details').length > 0;
  }

  public static hasForms($: cheerio.CheerioAPI): boolean {
    return $('form').length > 0;
  }
}
