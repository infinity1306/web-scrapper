import * as cheerio from 'cheerio';
import { TextCleaner } from '../cleaners/text';

export class TableExtractor {
  public static extract($: cheerio.CheerioAPI): Record<string, string>[][] {
    const tables: Record<string, string>[][] = [];

    $('table').each((_, tableEl) => {
      const tableData: Record<string, string>[] = [];
      const $table = $(tableEl);
      
      const headers: string[] = [];
      $table.find('thead tr th, tr th').each((__, th) => {
        const headerText = TextCleaner.normalize($(th).text()) || `Column_${headers.length}`;
        headers.push(headerText);
      });

      $table.find('tbody tr, tr').each((__, tr) => {
        // Skip header rows
        if ($(tr).find('th').length > 0 && $(tr).find('td').length === 0) return;

        const rowData: Record<string, string> = {};
        $(tr).find('td').each((index, td) => {
          const header = headers[index] || `Column_${index}`;
          rowData[header] = TextCleaner.normalize($(td).text());
        });

        if (Object.keys(rowData).length > 0) {
          tableData.push(rowData);
        }
      });

      if (tableData.length > 0) {
        tables.push(tableData);
      }
    });

    return tables;
  }
}
