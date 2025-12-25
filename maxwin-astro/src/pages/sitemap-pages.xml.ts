export async function GET() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
    
    <!-- Homepage -->
    <url>
        <loc>https://albert9.pages.dev/</loc>
        <lastmod>2025-12-25</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
        <image:image>
            <image:loc>https://albert9.pages.dev/logo.png</image:loc>
            <image:title>Maxwin584 - Güvenilir Bahis Sitesi</image:title>
        </image:image>
    </url>
    
    <!-- Main Pages -->
    <url>
        <loc>https://albert9.pages.dev/sport</loc>
        <lastmod>2025-12-25</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
    </url>
    
    <url>
        <loc>https://albert9.pages.dev/canli-bahis</loc>
        <lastmod>2025-12-25</lastmod>
        <changefreq>hourly</changefreq>
        <priority>0.95</priority>
    </url>
    
    <url>
        <loc>https://albert9.pages.dev/casino</loc>
        <lastmod>2025-12-25</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
    </url>
    
    <url>
        <loc>https://albert9.pages.dev/canli-casino</loc>
        <lastmod>2025-12-25</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
    </url>
    
    <url>
        <loc>https://albert9.pages.dev/slot-oyunlari</loc>
        <lastmod>2025-12-25</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
    </url>
    
    <url>
        <loc>https://albert9.pages.dev/promotions</loc>
        <lastmod>2025-12-25</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    
    <url>
        <loc>https://albert9.pages.dev/casino-bonuslari</loc>
        <lastmod>2025-12-25</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.85</priority>
    </url>
    
    <!-- User Pages -->
    <url>
        <loc>https://albert9.pages.dev/login</loc>
        <lastmod>2025-12-25</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
    
    <url>
        <loc>https://albert9.pages.dev/kayit</loc>
        <lastmod>2025-12-25</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
    
    <!-- Payment Pages -->
    <url>
        <loc>https://albert9.pages.dev/para-yatir</loc>
        <lastmod>2025-12-25</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
    
    <url>
        <loc>https://albert9.pages.dev/papara-ile-para-yatirma</loc>
        <lastmod>2025-12-25</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
    
    <url>
        <loc>https://albert9.pages.dev/banka-hesaplari</loc>
        <lastmod>2025-12-25</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
    
    <url>
        <loc>https://albert9.pages.dev/para-cekme</loc>
        <lastmod>2025-12-25</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
    
    <!-- Corporate Pages -->
    <url>
        <loc>https://albert9.pages.dev/hakkimizda</loc>
        <lastmod>2025-12-25</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
    
    <url>
        <loc>https://albert9.pages.dev/iletisim</loc>
        <lastmod>2025-12-25</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
    
    <url>
        <loc>https://albert9.pages.dev/lisans-bilgileri</loc>
        <lastmod>2025-12-25</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
    
    <url>
        <loc>https://albert9.pages.dev/gizlilik-politikasi</loc>
        <lastmod>2025-12-25</lastmod>
        <changefreq>yearly</changefreq>
        <priority>0.5</priority>
    </url>
    
    <url>
        <loc>https://albert9.pages.dev/kullanim-kosullari</loc>
        <lastmod>2025-12-25</lastmod>
        <changefreq>yearly</changefreq>
        <priority>0.5</priority>
    </url>
    
    <url>
        <loc>https://albert9.pages.dev/sorumlu-oyun</loc>
        <lastmod>2025-12-25</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
    
    <url>
        <loc>https://albert9.pages.dev/sikca-sorulan-sorular</loc>
        <lastmod>2025-12-25</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
    
    <!-- Mobile -->
    <url>
        <loc>https://albert9.pages.dev/mobil-uygulama</loc>
        <lastmod>2025-12-25</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    
    <url>
        <loc>https://albert9.pages.dev/mobil-bahis</loc>
        <lastmod>2025-12-25</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.75</priority>
    </url>
    
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
