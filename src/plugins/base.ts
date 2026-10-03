import { ScraperPage } from '../browser/page';
import { ExtractedData } from '../core/types';

export abstract class ScraperPlugin {
  public abstract name: string;
  
  // Method to determine if this plugin should handle the given URL
  public abstract canHandle(url: string, html: string, framework: string): boolean;
  
  // Main extraction method
  public abstract extract(page: ScraperPage, url: string): Promise<ExtractedData>;
}
