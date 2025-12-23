# 🚀 Quick Start Guide

## 1. Kurulum (İlk Kullanım)

```bash
# Bağımlılıkları yükle
npm install

# Playwright tarayıcılarını yükle
npm run install:browsers
```

## 2. Hızlı Test

```bash
# Example.com'u crawl et (örnek)
npm run example
```

## 3. Kendi Sitenizi Crawl Edin

```bash
# Basit kullanım
npm run crawl -- -u https://yoursite.com

# Detaylı kullanım
npm run crawl -- -u https://yoursite.com -o ./my-output -d 5 -p 100
```

## 4. Çıktıyı Kontrol Edin

```bash
# Çıktı dizinine git
cd crawled

# Dosyaları listele
ls -la html/
ls -la css/
ls -la images/
```

## Parametreler

- `-u, --url` - Başlangıç URL (zorunlu)
- `-o, --output` - Çıktı dizini (varsayılan: ./crawled)
- `-d, --depth` - Maksimum derinlik (varsayılan: 3)
- `-p, --pages` - Maksimum sayfa (varsayılan: 100)
- `--delay` - İstekler arası gecikme ms (varsayılan: 1000)

## Örnekler

### Tek Sayfa Crawl
```bash
npm run crawl -- -u https://example.com -d 0
```

### Hızlı Crawl (gecikme yok)
```bash
npm run crawl -- -u https://example.com --delay 0
```

### Derin Crawl
```bash
npm run crawl -- -u https://example.com -d 10 -p 500
```

### Sadece Aynı Domain
```bash
npm run crawl -- -u https://example.com --same-domain
```

### Tüm Domainler
```bash
npm run crawl -- -u https://example.com --all-domains
```

## Sorun Giderme

### "Cannot find playwright"
```bash
npm install
```

### "Browser not found"
```bash
npm run install:browsers
```

### Çok yavaş çalışıyor
```bash
# Delay'i azalt
npm run crawl -- -u https://example.com --delay 0
```

### Hafıza hatası
```bash
# Max pages'i düşür
npm run crawl -- -u https://example.com -p 50
```

## TypeScript Build

```bash
# Build yap
npm run build

# Build'den çalıştır
npm start -- -u https://example.com
```

---

Daha fazla bilgi için `README.md` dosyasına bakın.
