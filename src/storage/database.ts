import { StorageExporter } from './exporter';
import { ExtractedData } from '../core/types';
import { logger } from '../core/logger';

// Abstract interface for Database exporters
export abstract class DatabaseExporter implements StorageExporter {
  public abstract connect(): Promise<void>;
  public abstract disconnect(): Promise<void>;
  
  public async export(data: ExtractedData[], outputDir: string): Promise<void> {
    logger.info(`Exporting ${data.length} records to database...`);
    await this.connect();
    
    for (const record of data) {
      await this.insertRecord(record);
    }
    
    await this.disconnect();
    logger.info(`Successfully exported data to database.`);
  }

  protected abstract insertRecord(record: ExtractedData): Promise<void>;
}

// Scaffolding for SQLite/PostgreSQL
export class SqliteExporter extends DatabaseExporter {
  public async connect(): Promise<void> {
    logger.debug('Connecting to SQLite...');
    // Implementation for sqlite3 or similar goes here
  }

  public async disconnect(): Promise<void> {
    logger.debug('Disconnecting from SQLite...');
  }

  protected async insertRecord(record: ExtractedData): Promise<void> {
    // Insert into SQLite logic
  }
}

export class PostgresExporter extends DatabaseExporter {
  public async connect(): Promise<void> {
    logger.debug('Connecting to PostgreSQL...');
    // Implementation for pg or similar goes here
  }

  public async disconnect(): Promise<void> {
    logger.debug('Disconnecting from PostgreSQL...');
  }

  protected async insertRecord(record: ExtractedData): Promise<void> {
    // Insert into PG logic
  }
}
