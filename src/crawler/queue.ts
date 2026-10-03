import { CrawlQueueItem } from '../core/types';

export class CrawlQueue {
  private queue: CrawlQueueItem[] = [];
  private visited: Set<string> = new Set();

  public enqueue(item: CrawlQueueItem): void {
    if (!this.visited.has(item.url)) {
      this.queue.push(item);
      this.visited.add(item.url);
    }
  }

  public enqueueBatch(items: CrawlQueueItem[]): void {
    for (const item of items) {
      this.enqueue(item);
    }
  }

  public dequeue(): CrawlQueueItem | undefined {
    return this.queue.shift(); // BFS approach (FIFO). Use pop() for DFS.
  }

  public isEmpty(): boolean {
    return this.queue.length === 0;
  }

  public size(): number {
    return this.queue.length;
  }

  public hasVisited(url: string): boolean {
    return this.visited.has(url);
  }

  public getVisitedCount(): number {
    return this.visited.size;
  }
}
