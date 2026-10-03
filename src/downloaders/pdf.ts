import axios from 'axios';
const pdfParse = require('pdf-parse');
import { logger } from '../core/logger';

export class PdfDownloader {
  public static async downloadAndExtract(url: string): Promise<string | null> {
    try {
      logger.debug(`Downloading PDF: ${url}`);
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      
      const data = await pdfParse(response.data);
      logger.info(`Successfully parsed PDF: ${url}`);
      return data.text;
    } catch (error: any) {
      logger.error({ error: error.message }, `Failed to download or parse PDF: ${url}`);
      return null;
    }
  }
}
