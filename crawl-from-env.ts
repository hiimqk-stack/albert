import { PlaywrightCrawler } from './src/crawler.js';
import { resolve } from 'path';
import { readFileSync } from 'fs';

/**
 * .env dosyasından config oku ve crawler'ı çalıştır
 */
async function main() {
  // .env dosyasını oku
  const envPath = resolve('.env');
  let envContent: string;
  
  try {
    envContent = readFileSync(envPath, 'utf-8');
  } catch (error) {
    console.error('❌ .env dosyası bulunamadı!');
    console.log('💡 Önce şunu çalıştır: cp .env.example .env');
    process.exit(1);
  }

  // Env değerlerini parse et
  const config: Record<string, string> = {};
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      config[key.trim()] = valueParts.join('=').trim();
    }
  });

  // Validate START_URL
  if (!config.START_URL) {
    console.error('❌ .env dosyasında START_URL bulunamadı!');
    process.exit(1);
  }

  console.log('\n📋 .env Konfigürasyonu:');
  console.log(`   START_URL: ${config.START_URL}`);
  console.log(`   OUTPUT_DIR: ${config.OUTPUT_DIR || './crawled'}`);
  console.log(`   MAX_DEPTH: ${config.MAX_DEPTH || '3'}`);
  console.log(`   MAX_PAGES: ${config.MAX_PAGES || '100'}`);
  console.log(`   DELAY_MS: ${config.DELAY_MS || '1000'}`);
  console.log(`   SAME_DOMAIN_ONLY: ${config.SAME_DOMAIN_ONLY || 'true'}`);
  console.log(`   OFFLINE_MODE: ${config.OFFLINE_MODE || 'false'}\n`);

  const crawler = new PlaywrightCrawler({
    startUrl: config.START_URL,
    outputDir: resolve(config.OUTPUT_DIR || './crawled'),
    maxDepth: parseInt(config.MAX_DEPTH || '3'),
    maxPages: parseInt(config.MAX_PAGES || '100'),
    sameDomainOnly: config.SAME_DOMAIN_ONLY !== 'false',
    delay: parseInt(config.DELAY_MS || '1000'),
    timeout: parseInt(config.TIMEOUT_MS || '30000'),
    offlineMode: config.OFFLINE_MODE === 'true'
  });

  try {
    console.log('🎭 Playwright Crawler başlatılıyor...\n');
    await crawler.initialize();
    await crawler.start();
    console.log('\n✨ Crawling tamamlandı!\n');
  } catch (error) {
    console.error('❌ Hata:', error);
    process.exit(1);
  } finally {
    await crawler.close();
  }
}

main();
