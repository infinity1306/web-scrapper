export class TextCleaner {
  public static normalize(text: string): string {
    return text
      .replace(/[\r\n\t]+/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  public static normalizeUrl(url: string, baseUrl: string): string {
    try {
      return new URL(url, baseUrl).href;
    } catch {
      return url; // fallback if invalid
    }
  }
}
