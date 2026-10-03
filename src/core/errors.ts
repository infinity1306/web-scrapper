export class ScraperError extends Error {
  public statusCode?: number;
  public url?: string;

  constructor(message: string, url?: string, statusCode?: number) {
    super(message);
    this.name = 'ScraperError';
    this.url = url;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NetworkError extends ScraperError {
  constructor(message: string, url?: string, statusCode?: number) {
    super(message, url, statusCode);
    this.name = 'NetworkError';
  }
}

export class ExtractionError extends ScraperError {
  constructor(message: string, url?: string) {
    super(message, url);
    this.name = 'ExtractionError';
  }
}

export class PluginError extends ScraperError {
  constructor(message: string) {
    super(message);
    this.name = 'PluginError';
  }
}
