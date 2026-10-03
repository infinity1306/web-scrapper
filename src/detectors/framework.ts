import * as cheerio from 'cheerio';

export class FrameworkDetector {
  public static detect(html: string): string {
    const $ = cheerio.load(html);
    let framework = 'Unknown / Static';

    // React / Next.js
    if ($('#__next').length > 0 || $('[data-reactroot]').length > 0 || html.includes('_next/static')) {
      framework = 'Next.js / React';
    }
    // Vue / Nuxt.js
    else if ($('#__nuxt').length > 0 || html.includes('window.__NUXT__')) {
      framework = 'Nuxt.js / Vue';
    }
    else if ($('[data-v-app]').length > 0 || html.includes('vue.global.js')) {
      framework = 'Vue.js';
    }
    // Angular
    else if ($('[ng-app]').length > 0 || $('[ng-version]').length > 0) {
      framework = 'Angular';
    }
    // WordPress
    else if (html.includes('wp-content/themes') || html.includes('wp-includes')) {
      framework = 'WordPress';
    }
    // Drupal
    else if (html.includes('Drupal.settings') || $('meta[name="Generator"]').attr('content')?.includes('Drupal')) {
      framework = 'Drupal';
    }
    // Laravel
    else if (html.includes('laravel')) {
      framework = 'Laravel';
    }
    // ASP.NET
    else if ($('input[name="__VIEWSTATE"]').length > 0) {
      framework = 'ASP.NET WebForms';
    }

    return framework;
  }
}
