#!/usr/bin/env node
import { Command } from 'commander';
import { resolve } from 'path';
import chalk from 'chalk';
import { PlaywrightCrawler } from './crawler.js';

const program = new Command();

program
  .name('playwright-crawler')
  .description('Playwright-based recursive web crawler with network file capturing')
  .version('1.0.0')
  .requiredOption('-u, --url <url>', 'Başlangıç URL')
  .option('-o, --output <dir>', 'Çıktı dizini', './crawled')
  .option('-d, --depth <number>', 'Maksimum derinlik', '3')
  .option('-p, --pages <number>', 'Maksimum sayfa sayısı', '100')
  .option('--same-domain', 'Sadece aynı domain', true)
  .option('--all-domains', 'Tüm domainleri dahil et')
  .option('--delay <ms>', 'İstekler arası gecikme (ms)', '1000')
  .option('--timeout <ms>', 'Sayfa yükleme timeout (ms)', '30000')
  .option('--offline', 'Offline çalışan kopya oluştur (HTML linkleri düzelt)', false)
  .option('--exclude <patterns...>', 'Hariç tutulacak URL pattern\'leri (regex)')
  .option('--include <patterns...>', 'Dahil edilecek URL pattern\'leri (regex)')
  .action(async (options) => {
    try {
      console.log(chalk.cyan.bold('\n🎭 Playwright Recursive Crawler\n'));

      const config = {
        startUrl: options.url,
        outputDir: resolve(options.output),
        maxDepth: parseInt(options.depth),
        maxPages: parseInt(options.pages),
        sameDomainOnly: !options.allDomains,
        delay: parseInt(options.delay),
        timeout: parseInt(options.timeout),
        offlineMode: options.offline,
        excludePatterns: options.exclude?.map((p: string) => new RegExp(p)),
        includePatterns: options.include?.map((p: string) => new RegExp(p))
      };

      // URL validasyonu
      try {
        new URL(config.startUrl);
      } catch {
        console.error(chalk.red('❌ Geçersiz URL!'));
        process.exit(1);
      }

      const crawler = new PlaywrightCrawler(config);
      await crawler.initialize();
      await crawler.start();
      await crawler.close();

      console.log(chalk.green.bold('\n✨ İşlem başarıyla tamamlandı!\n'));
      process.exit(0);
    } catch (error) {
      console.error(chalk.red('\n❌ Kritik hata:'), error);
      process.exit(1);
    }
  });

program.parse();
