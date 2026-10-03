import { ScraperPlugin } from './base';
import { GenericPlugin } from './generic';

export class PluginManager {
  private plugins: ScraperPlugin[] = [];

  constructor() {
    // Register plugins here in order of priority (specific -> generic)
    this.register(new GenericPlugin());
  }

  public register(plugin: ScraperPlugin): void {
    this.plugins.push(plugin);
  }

  public getPluginFor(url: string, html: string, framework: string): ScraperPlugin {
    for (const plugin of this.plugins) {
      if (plugin.canHandle(url, html, framework)) {
        return plugin;
      }
    }
    return this.plugins[this.plugins.length - 1]; // Fallback to last (Generic)
  }
}
