import { chromium, Browser, Page, Response } from 'playwright';
import { CrawlerConfig, CrawlResult } from './types.js';
import { FileSaver } from './utils/file-saver.js';
import { URLQueue } from './utils/url-queue.js';
import { LinkParser } from './utils/link-parser.js';
import { HTMLRewriter } from './utils/html-rewriter.js';

export class PlaywrightCrawler {
  private browser: Browser | null = null;
  private fileSaver: FileSaver;
  private urlQueue: URLQueue;
  private linkParser: LinkParser;
  private config: Required<CrawlerConfig>;
  private pageCount = 0;
  private assetMap = new Map<string, string>(); // URL -> FilePath mapping

  constructor(config: CrawlerConfig) {
    // Default değerler
    this.config = {
      maxDepth: 3,
      maxPages: 100,
      sameDomainOnly: true,
      excludePatterns: [],
      includePatterns: [],
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      viewport: { width: 1920, height: 1080 },
      timeout: 30000,
      waitForSelector: 'body',
      delay: 1000,
      offlineMode: true,
      ...config
    };

    this.fileSaver = new FileSaver(
      this.config.outputDir,
      this.config.offlineMode,
      this.config.startUrl
    );
    this.urlQueue = new URLQueue();
    this.linkParser = new LinkParser();
  }

  /**
   * Tarayıcıyı başlat
   */
  async initialize(): Promise<void> {
    this.browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    console.log('✅ Tarayıcı başlatıldı');
  }

  /**
   * Network isteklerini yakala ve kaydet
   */
  private async setupNetworkInterceptor(page: Page): Promise<string[]> {
    const savedFiles: string[] = [];

    page.on('response', async (response: Response) => {
      try {
        const url = response.url();
        const status = response.status();

        // Sadece başarılı istekleri kaydet
        if (status < 200 || status >= 300) return;

        // Request type kontrolü
        const resourceType = response.request().resourceType();
        
        // HTML hariç tüm kaynakları kaydet
        if (resourceType !== 'document') {
          const contentType = response.headers()['content-type'];
          const body = await response.body().catch(() => null);

          if (body) {
            const filePath = await this.fileSaver.saveFile(url, body, contentType);
            savedFiles.push(filePath);
            
            // Asset mapping'e ekle (offline mode için)
            if (this.config.offlineMode) {
              this.assetMap.set(url, filePath);
            }
            
            console.log(`  📦 Kaydedildi: ${resourceType} - ${url.substring(0, 80)}`);
          }
        }
      } catch (error) {
        // Network hatalarını sessizce geç
      }
    });

    return savedFiles;
  }

  /**
   * Tek bir sayfayı crawl et
   */
  private async crawlPage(url: string, depth: number): Promise<CrawlResult> {
    const page = await this.browser!.newPage({
      userAgent: this.config.userAgent,
      viewport: this.config.viewport
    });

    const result: CrawlResult = {
      url,
      depth,
      timestamp: Date.now(),
      savedFiles: [],
      links: []
    };

    try {
      console.log(`\n🔍 [${depth}/${this.config.maxDepth}] ${url}`);

      // Network interceptor'ı aktif et
      const savedFiles = await this.setupNetworkInterceptor(page);

      // Sayfaya git
      await page.goto(url, {
        waitUntil: 'networkidle',
        timeout: this.config.timeout
      });

      // Selector'ı bekle (opsiyonel)
      if (this.config.waitForSelector) {
        await page.waitForSelector(this.config.waitForSelector, {
          timeout: 5000
        }).catch(() => {});
      }

      // HTML'i al
      let html = await page.content();
      
      // Offline mode: HTML'i rewrite et
      if (this.config.offlineMode) {
        try {
          // Çok büyük HTML'ler için kontrol (>5MB)
          const htmlSize = Buffer.byteLength(html, 'utf-8');
          if (htmlSize > 5 * 1024 * 1024) {
            console.log(`  ⚠️ HTML çok büyük (${(htmlSize / 1024 / 1024).toFixed(2)}MB), rewriting atlanıyor`);
          } else {
            const rewriter = new HTMLRewriter(url, '', this.assetMap);
            html = rewriter.rewrite(html);
            console.log(`  🔄 HTML linkleri düzeltildi`);
          }
        } catch (rewriteError) {
          console.log(`  ⚠️ HTML rewriting hatası, orijinal HTML kaydediliyor`);
          console.log(`     Hata: ${rewriteError instanceof Error ? rewriteError.message : String(rewriteError)}`);
        }
      }
      
      // HTML'i kaydet
      const htmlPath = await this.fileSaver.saveHtml(url, html);
      savedFiles.push(htmlPath);
      
      // Asset mapping'e ekle
      if (this.config.offlineMode) {
        this.assetMap.set(url, htmlPath);
      }

      console.log(`  ✅ HTML kaydedildi: ${htmlPath}`);

      // Linkleri çıkar
      const links = await this.linkParser.extractLinks(page, url);
      const filteredLinks = this.linkParser.filterLinks(links, this.config.startUrl, {
        sameDomainOnly: this.config.sameDomainOnly,
        excludePatterns: this.config.excludePatterns,
        includePatterns: this.config.includePatterns
      });

      result.savedFiles = savedFiles;
      result.links = filteredLinks;

      console.log(`  🔗 ${filteredLinks.length} link bulundu`);

      // Queue'ya ekle
      if (depth < this.config.maxDepth) {
        let addedCount = 0;
        for (const link of filteredLinks) {
          if (this.urlQueue.add(link, depth + 1)) {
            addedCount++;
          }
        }
        console.log(`  ➕ Queue'ya ${addedCount} yeni link eklendi`);
      }

    } catch (error) {
      result.error = error instanceof Error ? error.message : String(error);
      console.error(`  ❌ Hata: ${result.error}`);
    } finally {
      await page.close();
    }

    return result;
  }

  /**
   * Crawl işlemini başlat
   */
  async start(): Promise<void> {
    if (!this.browser) {
      await this.initialize();
    }

    console.log('\n🚀 Crawler başlatılıyor...');
    console.log(`📍 Başlangıç URL: ${this.config.startUrl}`);
    console.log(`📂 Çıktı dizini: ${this.config.outputDir}`);
    console.log(`🎯 Max derinlik: ${this.config.maxDepth}`);
    console.log(`📄 Max sayfa: ${this.config.maxPages}\n`);

    // İlk URL'i ekle
    this.urlQueue.add(this.config.startUrl, 0);

    // Queue boşalana veya limitlere ulaşana kadar devam et
    while (!this.urlQueue.isEmpty() && this.pageCount < this.config.maxPages) {
      const item = this.urlQueue.next();
      if (!item) break;

      await this.crawlPage(item.url, item.depth);
      this.urlQueue.markVisited(item.url);
      this.pageCount++;

      // İstatistikleri göster
      const stats = this.urlQueue.getStats();
      console.log(`\n📊 İlerleme: ${stats.visited}/${stats.total} sayfa | Queue: ${stats.pending}`);

      // Delay
      if (this.config.delay > 0) {
        await new Promise(resolve => setTimeout(resolve, this.config.delay));
      }
    }

    console.log('\n✅ Crawling tamamlandı!');
    console.log(`📁 Toplam ${this.pageCount} sayfa işlendi`);
    console.log(`💾 Çıktı dizini: ${this.config.outputDir}`);
  }

  /**
   * Tarayıcıyı kapat
   */
  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      console.log('🔒 Tarayıcı kapatıldı');
    }
  }
}
