export async function GET() {
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <sitemap>
        <loc>https://maxwin584.com/sitemap-pages.xml</loc>
        <lastmod>2025-12-25</lastmod>
    </sitemap>
    <sitemap>
        <loc>https://maxwin584.com/sitemap-blog.xml</loc>
        <lastmod>2025-12-25</lastmod>
    </sitemap>
    <sitemap>
        <loc>https://maxwin584.com/sitemap-games.xml</loc>
        <lastmod>2025-12-25</lastmod>
    </sitemap>
    <sitemap>
        <loc>https://maxwin584.com/sitemap-landing.xml</loc>
        <lastmod>2025-12-25</lastmod>
    </sitemap>
</sitemapindex>`;

  return new Response(sitemapIndex, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
