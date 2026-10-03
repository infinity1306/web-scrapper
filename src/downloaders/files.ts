import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { logger } from '../core/logger';

export class FileDownloader {
  public static async download(url: string, outputDir: string): Promise<string | null> {
    try {
      logger.debug(`Downloading file: ${url}`);
      const response = await axios.get(url, { responseType: 'stream' });
      
      const fileName = path.basename(new URL(url).pathname) || `download_${Date.now()}`;
      const filePath = path.join(outputDir, fileName);

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', () => {
          logger.info(`Successfully downloaded file: ${fileName}`);
          resolve(filePath);
        });
        writer.on('error', (err) => {
          logger.error(`Error writing file ${fileName}: ${err.message}`);
          reject(err);
        });
      });
    } catch (error: any) {
      logger.error({ error: error.message }, `Failed to download file: ${url}`);
      return null;
    }
  }
}
