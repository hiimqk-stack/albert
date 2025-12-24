export async function GET() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
    
    <!-- Homepage -->
    <url>
        <loc>https://maxwin584.com/</loc>
        <lastmod>2025-12-24</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    
    <!-- Sport Pages -->
    <url>
        <loc>https://maxwin584.com/sport</loc>
        <lastmod>2025-12-24</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
    </url>
    
    <!-- Casino Pages -->
    <url>
        <loc>https://maxwin584.com/casino</loc>
        <lastmod>2025-12-24</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
    </url>
    
    <!-- Promotions -->
    <url>
        <loc>https://maxwin584.com/promotions</loc>
        <lastmod>2025-12-24</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    
    <!-- Login -->
    <url>
        <loc>https://maxwin584.com/login</loc>
        <lastmod>2025-12-24</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
    
    <!-- Para Yatır -->
    <url>
        <loc>https://maxwin584.com/para-yatir</loc>
        <lastmod>2025-12-24</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
    
    <!-- Papara ile Para Yatırma -->
    <url>
        <loc>https://maxwin584.com/papara-ile-para-yatirma</loc>
        <lastmod>2025-12-24</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
    
    <!-- Banka Hesapları -->
    <url>
        <loc>https://maxwin584.com/banka-hesaplari</loc>
        <lastmod>2025-12-24</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
    
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
