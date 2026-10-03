import * as cheerio from 'cheerio';

export class HtmlCleaner {
  public static clean(html: string): cheerio.CheerioAPI {
    const $ = cheerio.load(html);

    // Remove unwanted elements
    const unwantedSelectors = [
      'script', 'noscript', 'style', 'iframe', 'svg', 'canvas', 
      'video', 'audio', 'object', 'embed', 'map', 'track',
      '.cookie-banner', '#cookie-consent', '[id*="cookie"]', '[class*="cookie"]',
      '.ad', '.ads', '[id*="ad-"]', '[class*="ad-"]',
      'header', 'footer', 'nav', 'aside' // optionally remove layout structures to focus on main content
    ];

    $(unwantedSelectors.join(', ')).remove();

    // Remove tracking attributes
    $('*').each((_, el) => {
      const element = el as any;
      Object.keys(element.attribs || {}).forEach(attr => {
        if (attr.startsWith('data-track') || attr.startsWith('onclick')) {
          $(el).removeAttr(attr);
        }
      });
    });

    return $;
  }
}
