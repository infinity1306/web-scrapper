import { ExtractedData } from '../core/types';

export interface StorageExporter {
  export(data: ExtractedData[], outputPath: string): Promise<void>;
}
