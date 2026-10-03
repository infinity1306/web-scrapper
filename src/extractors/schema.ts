import * as cheerio from 'cheerio';
import { TextCleaner } from '../cleaners/text';

export class SchemaExtractor {
  public static extract($: cheerio.CheerioAPI): Record<string, any> {
    const schema: Record<string, any> = {};

    // Look for JSON-LD scripts
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const parsed = JSON.parse($(el).html() || '{}');
        Object.assign(schema, parsed);
      } catch {
        // invalid JSON
      }
    });

    // Semantic inference for specific fields (e.g., collegeName, seats, fees)
    // This is a heuristic approach matching the project goal
    const bodyText = $('body').text().toLowerCase();

    // College Name heuristics
    const h1 = TextCleaner.normalize($('h1').first().text());
    if (h1 && (h1.toLowerCase().includes('college') || h1.toLowerCase().includes('university') || h1.toLowerCase().includes('institute'))) {
      schema['collegeName'] = h1;
    }

    // State heuristics
    const stateMatches = bodyText.match(/(?:state|location):\s*([a-zA-Z\s]+)/i);
    if (stateMatches && stateMatches[1]) {
      schema['state'] = TextCleaner.normalize(stateMatches[1].split('\n')[0]);
    }

    // Fees heuristics
    const feesMatches = bodyText.match(/(?:fees|fee|tuition):\s*([0-9,₹$€]+)/i);
    if (feesMatches && feesMatches[1]) {
      schema['fees'] = feesMatches[1].trim();
    }

    // Seats heuristics
    const seatsMatches = bodyText.match(/(?:seats|intake|capacity):\s*([0-9]+)/i);
    if (seatsMatches && seatsMatches[1]) {
      schema['seats'] = seatsMatches[1].trim();
    }

    return schema;
  }
}
