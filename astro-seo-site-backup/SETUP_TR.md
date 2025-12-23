# 🚀 Astro SEO Sitesi - Kurulum Rehberi (Türkçe)

## 🎯 Özellikler

Bu Astro projesi **maksimum SEO** için optimize edilmiştir:

### ✅ SEO Özellikleri
- SSG (Static Site Generation) - Tüm sayfalar pre-rendered
- Sitemap.xml otomatik oluşturma
- Robots.txt otomatik oluşturma
- Schema.org JSON-LD her sayfada
- Open Graph + Twitter Cards
- Canonical URL'ler
- Clean URLs (trailing slash yok)
- WebP image optimization (Sharp)
- Gzip compression
- H1-H6 semantic hierarchy

### 📊 Hedef: Lighthouse 100/100

## 🛠️ Kurulum

### 1. Bağımlılıkları Yükle
```bash
cd astro-seo-site
npm install
```

### 2. Site URL'ini Güncelle
`astro.config.mjs` dosyasını aç:
```js
export default defineConfig({
  site: 'https://maxwin580.com', // Kendi domain'ini yaz
  // ...
});
```

### 3. Development Server'ı Başlat
```bash
npm run dev
```
Tarayıcıda aç: `http://localhost:4321`

### 4. Production Build
```bash
npm run build
```
Çıktı: `dist/` klasörü

## 📝 Sayfa Oluşturma

### Yeni Sayfa Ekle

1. `src/pages/` klasöründe yeni dosya oluştur:

```astro
---
// src/pages/yeni-sayfa.astro
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout
  title="Yeni Sayfa - Maxwin580"
  description="Sayfa açıklaması (150-160 karakter)"
  type="website"
>
  <main>
    <h1>Yeni Sayfa</h1>
    <p>İçerik buraya...</p>
  </main>
</BaseLayout>
```

2. Build yap - sitemap otomatik güncellenir!

### Blog Yazısı Ekle

1. `src/content/blog/` klasöründe `.md` dosyası oluştur:

```md
---
title: 'Blog Yazısı Başlığı'
description: 'Yazı açıklaması'
publishedDate: 2024-12-17
author: 'Yazar Adı'
tags: ['etiket1', 'etiket2']
---

# Yazı Başlığı

İçerik buraya...
```

## 🎨 Özelleştirme

### Renkleri Değiştir

`src/layouts/BaseLayout.astro` içindeki CSS değişkenlerini düzenle:

```css
:root {
  --color-primary: #4796EC;    /* Ana renk */
  --color-secondary: #2c3e50;  /* İkincil renk */
  --color-text: #333;
  --color-bg: #fff;
}
```

### Schema.org Verisi Ekle

Sayfa başlığına custom schema ekle:

```astro
---
const customSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Maxwin580',
  url: 'https://maxwin580.com',
  logo: 'https://maxwin580.com/logo.png'
};
---

<BaseLayout schema={customSchema}>
  <!-- İçerik -->
</BaseLayout>
```

## 📊 SEO Kontrol Listesi

Deploy ettikten sonra:

- [ ] **Google Search Console** - Sitemap ekle
- [ ] **Lighthouse** - Performance testi yap (hedef: 100)
- [ ] **Meta Tags** - [metatags.io](https://metatags.io/) ile kontrol et
- [ ] **Schema Markup** - [Schema Validator](https://validator.schema.org/) ile test et
- [ ] **Mobile Friendly** - Google Mobile-Friendly Test
- [ ] **Page Speed** - [PageSpeed Insights](https://pagespeed.web.dev/)

## 🚀 Deployment

### Netlify
```bash
npm run build
# dist/ klasörünü yükle
```

### Vercel
```bash
vercel --prod
```

### Herhangi Bir Static Host
`dist/` klasörünü upload et.

## 📁 Dosya Yapısı

```
astro-seo-site/
├── public/              # Static dosyalar
│   ├── favicon.svg
│   └── robots.txt       # Otomatik oluşur
├── src/
│   ├── components/
│   │   └── SEO.astro    # SEO komponenti
│   ├── content/
│   │   ├── blog/        # Blog yazıları (.md)
│   │   └── config.ts    # Content schema
│   ├── layouts/
│   │   └── BaseLayout.astro  # Ana layout
│   └── pages/
│       ├── index.astro       # Ana sayfa
│       └── about.astro       # Hakkımızda
└── astro.config.mjs     # SEO ayarları
```

## 🔧 Komutlar

| Komut | Açıklama |
|-------|----------|
| `npm run dev` | Development server başlat |
| `npm run build` | Production build |
| `npm run preview` | Build'i önizle |
| `npm run astro check` | Type check |

## 🎯 SEO Best Practices

### 1. Title Tag
- 50-60 karakter
- Unique her sayfada
- Keyword içermeli

### 2. Meta Description
- 150-160 karakter
- Call-to-action içermeli
- Unique her sayfada

### 3. H1-H6 Hiyerarşi
- Her sayfada 1 tane H1
- H2, H3... mantıklı sırada
- Keyword içermeli

### 4. Image Optimization
- Alt text ekle
- WebP formatı kullan
- Lazy loading (Astro otomatik)

### 5. Internal Linking
- İlgili sayfalara link ver
- Descriptive anchor text
- Broken link kontrolü

## 🆘 Sorun Giderme

### Build Hatası
```bash
# Cache'i temizle
rm -rf node_modules .astro
npm install
```

### Sitemap Oluşmuyor
`astro.config.mjs` içinde `site` URL'ini kontrol et.

### Image Optimization Çalışmıyor
Sharp kurulu mu kontrol et:
```bash
npm install sharp
```

## 📚 Kaynaklar

- [Astro Docs](https://docs.astro.build)
- [SEO Guide](https://docs.astro.build/en/guides/seo/)
- [Content Collections](https://docs.astro.build/en/guides/content-collections/)

---

**✨ Lighthouse 100 için hazır!**
