# 🚀 Maxwin580 - SEO-Optimized Astro Site

Production-ready Astro website with **maximum SEO optimization** for Lighthouse 100 score.

## ✨ SEO Features

### 🎯 **Core SEO**
- ✅ **SSG (Static Site Generation)** - Pre-rendered pages
- ✅ **Clean URLs** - No trailing slashes (`/about` not `/about/`)
- ✅ **Sitemap.xml** - Auto-generated with @astrojs/sitemap
- ✅ **Robots.txt** - Automatic generation with astro-robots-txt
- ✅ **Canonical URLs** - Proper canonical tags on every page

### 📱 **Meta Tags & Social**
- ✅ **Meta Description** - Unique for each page
- ✅ **Open Graph Tags** - Facebook/LinkedIn optimization
- ✅ **Twitter Cards** - Rich Twitter previews
- ✅ **Structured Data** - Schema.org JSON-LD on every page

### 🖼️ **Performance**
- ✅ **Image Optimization** - Sharp for WebP conversion
- ✅ **CSS Code Splitting** - Automatic by Astro
- ✅ **Minification** - ESBuild for JS/CSS
- ✅ **Gzip Compression** - Smaller file sizes
- ✅ **Preconnect** - DNS prefetch for faster loading

### 📝 **Content**
- ✅ **Content Collections** - Type-safe content management
- ✅ **Markdown Support** - Built-in blog system
- ✅ **H1-H6 Hierarchy** - Semantic HTML structure
- ✅ **Alt Text Ready** - Image accessibility

## 📁 Project Structure

```
/
├── public/
│   ├── favicon.svg
│   └── robots.txt           # Auto-generated
├── src/
│   ├── components/
│   │   └── SEO.astro        # SEO component
│   ├── content/
│   │   ├── blog/            # Blog posts
│   │   │   └── hosgeldin-bonusu.md
│   │   └── config.ts        # Content Collections schema
│   ├── layouts/
│   │   └── BaseLayout.astro # Base layout with SEO
│   └── pages/
│       ├── index.astro      # Homepage
│       └── about.astro      # About page
├── astro.config.mjs         # Astro + SEO configuration
└── package.json
```

## 🛠️ Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Update Site URL
Edit `astro.config.mjs`:
```js
export default defineConfig({
  site: 'https://your-domain.com', // Update this!
  // ...
});
```

### 3. Run Development Server
```bash
npm run dev
```
Visit `http://localhost:4321`

### 4. Build for Production
```bash
npm run build
```
Output: `dist/` folder

### 5. Preview Production Build
```bash
npm run preview
```

## 📝 Usage

### Creating a New Page

1. Create file in `src/pages/`:
```astro
---
// src/pages/your-page.astro
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout
  title="Your Page Title - Maxwin580"
  description="Your page description (150-160 characters)"
  type="website"
>
  <main>
    <h1>Your Page Title</h1>
    <p>Content here...</p>
  </main>
</BaseLayout>
```

2. Build and sitemap auto-updates!

### Creating a Blog Post

1. Create `.md` file in `src/content/blog/`:
```md
---
title: 'Your Blog Post Title'
description: 'Post description'
publishedDate: 2024-12-17
author: 'Author Name'
tags: ['tag1', 'tag2']
---

# Your Post Title

Content here...
```

2. Create blog index page to list posts (example in docs)

### SEO Component Props

```astro
<SEO
  title="Page Title"                    // Required
  description="Page description"         // Required
  image="/og-image.jpg"                 // Optional
  canonical="https://custom-url.com"    // Optional
  noindex={false}                       // Optional
  type="website"                        // website|article|product
  publishedTime="2024-12-17"           // For articles
  author="Author Name"                  // For articles
  schema={customSchema}                 // Custom JSON-LD
/>
```

## 🎨 Customization

### Update Colors
Edit `src/layouts/BaseLayout.astro`:
```css
:root {
  --color-primary: #4796EC;
  --color-secondary: #2c3e50;
  /* ... */
}
```

### Update Schema.org Data
Edit page frontmatter or pass custom `schema` prop.

### Add More Content Collections
Edit `src/content/config.ts`:
```ts
export const collections = {
  blog: blogCollection,
  products: productCollection, // Add new!
};
```

## 📊 SEO Checklist

After deployment, verify:

- [ ] Google Search Console - Submit sitemap
- [ ] Lighthouse Score - Run audit (target: 100)
- [ ] Meta Tags - Use [metatags.io](https://metatags.io/)
- [ ] Structured Data - Test with [Schema Validator](https://validator.schema.org/)
- [ ] Mobile Friendly - Test with Google Mobile-Friendly Test
- [ ] Page Speed - Test with [PageSpeed Insights](https://pagespeed.web.dev/)

## 🚀 Deployment

### Netlify
```bash
npm run build
# Deploy dist/ folder
```

### Vercel
```bash
vercel --prod
```

### Static Hosting
Upload `dist/` folder to any static host.

## 🔧 Configuration Files

### `astro.config.mjs`
- Site URL
- SSG/SSR mode
- Image optimization
- Sitemap settings
- Robots.txt rules

### `src/content/config.ts`
- Content Collections schema
- Type safety for Markdown

### `src/components/SEO.astro`
- Meta tags
- Open Graph
- Twitter Cards
- Schema.org JSON-LD

## 📚 Tech Stack

- **Astro** ^5.16.6 - Static Site Generator
- **@astrojs/sitemap** - Sitemap generation
- **astro-robots-txt** - robots.txt generation
- **Sharp** - Image optimization (WebP)
- **TypeScript** - Type safety

## 🎯 Lighthouse Score Target

- **Performance:** 100
- **Accessibility:** 100
- **Best Practices:** 100
- **SEO:** 100

## 📖 Resources

- [Astro Docs](https://docs.astro.build)
- [SEO Best Practices](https://web.dev/lighthouse-seo/)
- [Schema.org](https://schema.org)
- [Open Graph Protocol](https://ogp.me/)

## 📄 License

MIT

---

**Built with ❤️ for maximum SEO performance**
