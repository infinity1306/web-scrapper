import * as fs from 'fs';
import * as path from 'path';
import { format } from 'fast-csv';
import { StorageExporter } from './exporter';
import { ExtractedData } from '../core/types';
import { logger } from '../core/logger';

export class CsvExporter implements StorageExporter {
  public async export(data: ExtractedData[], outputDir: string): Promise<void> {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const filePath = path.join(outputDir, `export_${Date.now()}.csv`);
    const csvStream = format({ headers: true });
    const writableStream = fs.createWriteStream(filePath);

    return new Promise((resolve, reject) => {
      writableStream.on('finish', () => {
        logger.info(`Data exported successfully to ${filePath}`);
        resolve();
      });
      writableStream.on('error', reject);

      csvStream.pipe(writableStream);

      for (const row of data) {
        // Flatten simple fields for CSV
        csvStream.write({
          url: row.url,
          title: row.title,
          description: row.description,
          framework: row.framework,
          schema: JSON.stringify(row.schema),
        });
      }

      csvStream.end();
    });
  }
}
