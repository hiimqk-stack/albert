import { QueueItem } from '../types.js';

export class URLQueue {
  private queue: QueueItem[] = [];
  private visited = new Set<string>();
  private processing = new Set<string>();

  /**
   * URL'i normalize et (tutarlı hash için)
   */
  private normalizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      // Hash ve trailing slash'i kaldır
      urlObj.hash = '';
      let normalized = urlObj.href;
      if (normalized.endsWith('/') && urlObj.pathname !== '/') {
        normalized = normalized.slice(0, -1);
      }
      return normalized;
    } catch {
      return url;
    }
  }

  /**
   * Queue'ya URL ekle
   */
  add(url: string, depth: number): boolean {
    const normalized = this.normalizeUrl(url);

    if (this.visited.has(normalized) || this.processing.has(normalized)) {
      return false;
    }

    this.queue.push({ url: normalized, depth });
    return true;
  }

  /**
   * Queue'dan URL al
   */
  next(): QueueItem | null {
    if (this.queue.length === 0) {
      return null;
    }

    const item = this.queue.shift()!;
    this.processing.add(item.url);
    return item;
  }

  /**
   * URL'i işlenmiş olarak işaretle
   */
  markVisited(url: string): void {
    const normalized = this.normalizeUrl(url);
    this.processing.delete(normalized);
    this.visited.add(normalized);
  }

  /**
   * URL'in ziyaret edilip edilmediğini kontrol et
   */
  isVisited(url: string): boolean {
    return this.visited.has(this.normalizeUrl(url));
  }

  /**
   * Queue boş mu?
   */
  isEmpty(): boolean {
    return this.queue.length === 0;
  }

  /**
   * İstatistikler
   */
  getStats() {
    return {
      pending: this.queue.length,
      processing: this.processing.size,
      visited: this.visited.size,
      total: this.visited.size + this.processing.size + this.queue.length
    };
  }
}
