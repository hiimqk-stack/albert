import { PlaywrightCrawler } from './src/crawler.js';
import { resolve } from 'path';

/**
 * Örnek kullanım - Example.com sitesini crawl et
 */
async function main() {
  const crawler = new PlaywrightCrawler({
    startUrl: 'https://example.com',
    outputDir: resolve('./crawled-example'),
    maxDepth: 2,
    maxPages: 10,
    sameDomainOnly: true,
    delay: 500,
    timeout: 30000
  });

  try {
    console.log('🚀 Crawler başlatılıyor...\n');
    await crawler.initialize();
    await crawler.start();
    console.log('\n✅ Crawling tamamlandı!');
  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await crawler.close();
  }
}

main();
