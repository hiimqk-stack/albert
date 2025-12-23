export interface CrawlerConfig {
  startUrl: string;
  outputDir: string;
  maxDepth?: number;
  maxPages?: number;
  sameDomainOnly?: boolean;
  excludePatterns?: RegExp[];
  includePatterns?: RegExp[];
  userAgent?: string;
  viewport?: { width: number; height: number };
  timeout?: number;
  waitForSelector?: string;
  delay?: number;
  offlineMode?: boolean; // Offline çalışan kopya oluştur
}

export interface CrawlResult {
  url: string;
  depth: number;
  timestamp: number;
  savedFiles: string[];
  links: string[];
  error?: string;
}

export interface QueueItem {
  url: string;
  depth: number;
}

export enum ResourceType {
  HTML = 'html',
  CSS = 'css',
  JS = 'js',
  IMAGE = 'images',
  FONT = 'fonts',
  MEDIA = 'media',
  OTHER = 'other'
}
