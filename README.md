# 🎭 Playwright Recursive Crawler

Playwright tabanlı, headless tarayıcı kullanarak web sitelerini recursive olarak tarayan ve tüm network dosyalarını kaydeden güçlü bir crawler.

## ✨ Özellikler

- **Playwright** ile gerçek tarayıcı simülasyonu
- **Network yakalama** - Tüm CSS, JS, resim, font dosyalarını kaydet
- **Recursive crawling** - Derinlik kontrolü ile linkler arasında gezinme
- **Queue sistemi** - Duplicate URL kontrolü
- **Filtering** - Include/exclude pattern desteği
- **Same-domain** - Sadece aynı domain veya tüm domainler
- **TypeScript** - Tam tip güvenliği

## 📦 Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Playwright tarayıcılarını yükle
npm run install:browsers

# TypeScript build
npm run build
```

## 🚀 Kullanım

### CLI ile

```bash
# Basit kullanım
npm run crawl -- -u https://example.com

# Detaylı kullanım
npm run crawl -- \
  -u https://example.com \
  -o ./my-output \
  -d 5 \
  -p 200 \
  --delay 2000 \
  --same-domain

# Tüm domainleri dahil et
npm run crawl -- -u https://example.com --all-domains

# Pattern filtering
npm run crawl -- -u https://example.com \
  --exclude ".*\\.pdf$" ".*login.*" \
  --include ".*\\.html$" ".*\\.php$"
```

### Programatik Kullanım

```typescript
import { PlaywrightCrawler } from './crawler.js';

const crawler = new PlaywrightCrawler({
  startUrl: 'https://example.com',
  outputDir: './crawled',
  maxDepth: 3,
  maxPages: 100,
  sameDomainOnly: true,
  delay: 1000,
  excludePatterns: [/\.pdf$/, /login/],
  includePatterns: [/\.html$/]
});

await crawler.initialize();
await crawler.start();
await crawler.close();
```

## 📁 Çıktı Yapısı

```
crawled/
├── html/           # HTML dosyaları
│   ├── index.html
│   └── about.html
├── css/            # CSS dosyaları
├── js/             # JavaScript dosyaları
├── images/         # Resim dosyaları
├── fonts/          # Font dosyaları
├── media/          # Video/audio dosyaları
└── other/          # Diğer dosyalar
```

## ⚙️ CLI Seçenekleri

| Parametre | Kısaltma | Açıklama | Varsayılan |
|-----------|----------|----------|------------|
| `--url` | `-u` | Başlangıç URL (zorunlu) | - |
| `--output` | `-o` | Çıktı dizini | `./crawled` |
| `--depth` | `-d` | Maksimum derinlik | `3` |
| `--pages` | `-p` | Maksimum sayfa sayısı | `100` |
| `--same-domain` | - | Sadece aynı domain | `true` |
| `--all-domains` | - | Tüm domainleri dahil et | `false` |
| `--delay` | - | İstekler arası gecikme (ms) | `1000` |
| `--timeout` | - | Sayfa timeout (ms) | `30000` |
| `--exclude` | - | Hariç tutulacak pattern'ler | `[]` |
| `--include` | - | Dahil edilecek pattern'ler | `[]` |

## 🎯 Kullanım Senaryoları

### 1. Statik Site Arşivleme
```bash
npm run crawl -- -u https://mysite.com -d 10 -p 1000
```

### 2. Tek Sayfa Crawl (Depth=0)
```bash
npm run crawl -- -u https://example.com -d 0
```

### 3. Sadece HTML ve CSS
```bash
npm run crawl -- -u https://example.com \
  --include ".*\\.(html|css)$"
```

### 4. Login/Admin Sayfalarını Hariç Tut
```bash
npm run crawl -- -u https://example.com \
  --exclude ".*login.*" ".*admin.*"
```

## 🔧 Mimari

```
src/
├── index.ts              # CLI entry point
├── crawler.ts            # Ana crawler sınıfı
├── types.ts              # TypeScript tip tanımları
└── utils/
    ├── file-saver.ts     # Dosya kaydetme logic
    ├── url-queue.ts      # URL queue yönetimi
    └── link-parser.ts    # Link bulma ve filtering
```

## 📊 Network Yakalama

Crawler tüm network isteklerini yakalar:

- ✅ **Images**: jpg, png, gif, svg, webp, ico
- ✅ **Styles**: css
- ✅ **Scripts**: js, mjs, jsx
- ✅ **Fonts**: woff, woff2, ttf, otf
- ✅ **Media**: mp4, webm, mp3, wav
- ✅ **HTML**: Sayfa içerikleri

## 🛡️ Best Practices

1. **Rate Limiting**: `--delay` parametresi ile sunucuya yük bindirmeyin
2. **Timeout**: Yavaş sitelerde `--timeout` değerini artırın
3. **Max Pages**: Büyük sitelerde `--pages` ile limit koyun
4. **Filtering**: Gereksiz dosyaları `--exclude` ile filtreleyin
5. **robots.txt**: Sitenin robots.txt kurallarına uyun

## 🐛 Troubleshooting

### Tarayıcı Hatası
```bash
# Playwright tarayıcılarını yeniden yükle
npm run install:browsers
```

### Memory Hatası
```bash
# Max pages değerini düşür
npm run crawl -- -u https://example.com -p 50
```

### Network Timeout
```bash
# Timeout değerini artır
npm run crawl -- -u https://example.com --timeout 60000
```

## 📝 Lisans

MIT

## 🤝 Katkı

Pull request'ler memnuniyetle karşılanır!
