import * as cheerio from 'cheerio';
import { TextCleaner } from '../cleaners/text';

export class FormExtractor {
  public static extract($: cheerio.CheerioAPI): Record<string, any>[] {
    const forms: Record<string, any>[] = [];

    $('form').each((_, formEl) => {
      const formObj: Record<string, any> = {
        action: $(formEl).attr('action') || '',
        method: ($(formEl).attr('method') || 'GET').toUpperCase(),
        inputs: [],
      };

      $(formEl).find('input, select, textarea, button').each((__, inputEl) => {
        const tagName = ($(inputEl).prop('tagName') || '').toLowerCase();
        const type = tagName === 'input' 
          ? $(inputEl).attr('type') || 'text' 
          : tagName;
        
        const name = $(inputEl).attr('name');
        if (name) {
          formObj.inputs.push({
            name,
            type,
            value: $(inputEl).val() || '',
            placeholder: $(inputEl).attr('placeholder') || '',
          });
        }
      });

      forms.push(formObj);
    });

    return forms;
  }
}
