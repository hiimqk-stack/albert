# 🌐 Offline Mode Kullanım Kılavuzu

## Ne Değişti?

Artık crawler **2 mod**da çalışabilir:

### 1️⃣ Normal Mode (Varsayılan)
- Dosya arşivi
- Linkler düzeltilmez
- Flat dizin yapısı
```
crawled/
├── html/
├── css/
├── js/
└── images/
```

### 2️⃣ Offline Mode (YENİ! 🎉)
- Tam çalışan kopya
- HTML linkleri düzeltilir
- Path yapısı korunur
- Tarayıcıda açılabilir
```
crawled/
└── maxwin580.com/
    ├── index.html
    ├── tr/play/fun/
    │   └── game.html
    └── assets/
        ├── style.css
        ├── app.js
        └── logo.png
```

---

## 🚀 Nasıl Kullanılır?

### Yöntem 1: CLI ile

```bash
# Offline mode aktif
npm run crawl -- -u https://maxwin580.com --offline

# Normal mode (varsayılan)
npm run crawl -- -u https://maxwin580.com
```

### Yöntem 2: .env dosyası ile

**.env dosyasını güncelle:**
```bash
# .env.example'dan yeni parametreyi kopyala
OFFLINE_MODE=true
```

Sonra çalıştır:
```bash
npm run crawl:env
```

---

## 📊 Karşılaştırma

| Özellik | Normal Mode | Offline Mode |
|---------|-------------|--------------|
| HTML kaydet | ✅ | ✅ |
| CSS/JS kaydet | ✅ | ✅ |
| **Link düzelt** | ❌ | ✅ |
| **Path koru** | ❌ | ✅ |
| **Tarayıcıda aç** | ❌ | ✅ |
| Çıktı boyutu | Daha küçük | Aynı |
| İşlem süresi | Daha hızlı | +%5 yavaş |

---

## 🎯 Offline Mode'da Ne Yapılıyor?

### 1. HTML Link Rewriting
```html
<!-- ÖNCE: -->
<link href="https://cdn.maxwin580.com/style.css">
<script src="https://cdn.maxwin580.com/app.js">
<img src="https://cdn.maxwin580.com/logo.png">
<a href="/tr/play/fun/game">

<!-- SONRA: -->
<link href="../../assets/cdn.maxwin580.com/style.css">
<script src="../../assets/cdn.maxwin580.com/app.js">
<img src="../../assets/cdn.maxwin580.com/logo.png">
<a href="./tr/play/fun/game.html">
```

### 2. Base URL Injection
```html
<head>
  <base href="https://maxwin580.com/">
  <!-- Relative URL'ler için fallback -->
</head>
```

### 3. Path Structure Preservation
```
https://maxwin580.com/tr/play/fun/game
  ↓
crawled/maxwin580.com/tr/play/fun/game.html
```

### 4. Asset Mapping
- Her URL → FilePath mapping
- HTML'de doğru relative path'ler

---

## 📝 Örnek Kullanım

### Test (Example.com)
```bash
npm run crawl -- \
  -u https://example.com \
  --offline \
  -d 2 \
  -p 10
```

Çıktı:
```
crawled/example.com/
├── index.html          ← Açılabilir!
└── assets/
    └── style.css
```

### Production (Maxwin580)
```bash
# .env dosyasını güncelle
OFFLINE_MODE=true
MAX_PAGES=1000

# Çalıştır
npm run crawl:env
```

Çıktı:
```
crawled/maxwin580.com/
├── index.html
├── tr/
│   └── play/
│       └── fun/
│           ├── game1.html
│           └── game2.html
└── assets/
    ├── cdn.maxwin580.com/
    │   └── plat/prd/CW/GPB/
    │       ├── Content/style.css
    │       └── Scripts/app.js
    └── cdn.kel241tanvik.com/
        └── game-ui/assets/
```

---

## 🎬 Tarayıcıda Açma

### Normal Mode
```bash
cd crawled/html
open index.html
# ❌ Beyaz ekran veya kırık sayfa
```

### Offline Mode
```bash
cd crawled/maxwin580.com
open index.html
# ✅ Site açılır, linkler çalışır!
```

---

## ⚠️ Bilinen Sınırlamalar

1. **External CDN'ler**
   - Google Fonts, Cloudflare CDN gibi external kaynaklar indirilemez
   - Bunlar orijinal URL'lerinden yüklenmeye devam eder
   - İnternet bağlantısı gerektirebilir

2. **Dynamic JavaScript**
   - Infinite scroll, lazy loading gibi özellikler eksik olabilir
   - Sadece sayfa yüklendiğinde görünen içerik alınır

3. **API Calls**
   - JavaScript'in yaptığı API çağrıları çalışmayabilir
   - CORS hataları olabilir

4. **Absolute URL'ler**
   - Bazı JavaScript'ler hardcoded URL'ler içerebilir
   - Bunlar düzeltilemez

---

## 🔧 .env Güncellemesi

.env dosyanıza şu satırı ekleyin:

```bash
# Offline çalışan tam kopya
OFFLINE_MODE=true
```

Veya `.env.example`'dan güncel versiyonu kopyalayın:
```bash
cp .env.example .env
```

---

## 📚 Daha Fazla Bilgi

- **Normal mode**: Dosya arşivi, backup için
- **Offline mode**: Çalışan kopya, offline kullanım için

Hangisini seçeceğiniz kullanım amacınıza bağlı!
