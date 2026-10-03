import * as fs from 'fs';
import * as path from 'path';
import { StorageExporter } from './exporter';
import { ExtractedData } from '../core/types';
import { logger } from '../core/logger';

export class JsonExporter implements StorageExporter {
  public async export(data: ExtractedData[], outputDir: string): Promise<void> {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const filePath = path.join(outputDir, `export_${Date.now()}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    logger.info(`Data exported successfully to ${filePath}`);
  }
}
