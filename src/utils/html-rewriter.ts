/**
 * HTML içeriğini offline çalışacak şekilde yeniden yazar
 * - Absolute URL'leri relative path'lere çevirir
 * - Asset linklerini düzeltir
 * - Base URL ekler
 */
export class HTMLRewriter {
  private baseUrl: string;
  private currentPagePath: string;
  private assetMap: Map<string, string>;

  constructor(baseUrl: string, currentPagePath: string, assetMap: Map<string, string>) {
    this.baseUrl = baseUrl;
    this.currentPagePath = currentPagePath;
    this.assetMap = assetMap;
  }

  /**
   * HTML içeriğini yeniden yaz
   */
  rewrite(html: string): string {
    let rewritten = html;

    try {
      // 1. Base tag ekle (relative URL'ler için)
      rewritten = this.addBaseTag(rewritten);

      // 2. CSS linklerini düzelt
      rewritten = this.rewriteCSSLinks(rewritten);

      // 3. Script linklerini düzelt
      rewritten = this.rewriteScriptLinks(rewritten);

      // 4. Image linklerini düzelt
      rewritten = this.rewriteImageLinks(rewritten);

      // 5. Anchor linklerini düzelt
      rewritten = this.rewriteAnchorLinks(rewritten);

      // 6. Inline style'daki url() fonksiyonlarını düzelt
      rewritten = this.rewriteInlineStyles(rewritten);
    } catch (error) {
      // Herhangi bir rewriting hatasında orijinal HTML'i döndür
      console.error('HTMLRewriter hatası:', error instanceof Error ? error.message : String(error));
      return html;
    }

    return rewritten;
  }

  /**
   * Base tag ekle veya güncelle
   */
  private addBaseTag(html: string): string {
    const baseUrl = new URL(this.baseUrl);
    const baseTag = `<base href="${baseUrl.origin}/">`;

    // Mevcut base tag varsa değiştir
    if (/<base\s+[^>]*href=/i.test(html)) {
      return html.replace(/<base\s+[^>]*>/i, baseTag);
    }

    // Head içine ekle
    if (/<head[^>]*>/i.test(html)) {
      return html.replace(/(<head[^>]*>)/i, `$1\n  ${baseTag}`);
    }

    // Head yoksa html tag'inden sonra ekle
    return html.replace(/(<html[^>]*>)/i, `$1\n<head>\n  ${baseTag}\n</head>`);
  }

  /**
   * CSS link taglerini düzelt
   */
  private rewriteCSSLinks(html: string): string {
    try {
      return html.replace(
        /<link\s+([^>]*href=["']?)([^"'\s>]+)(["']?[^>]*)>/gi,
        (match, before, url, after) => {
          try {
            if (!url.includes('.css') && !match.includes('stylesheet')) {
              return match;
            }
            const newUrl = this.resolveAssetUrl(url, 'css');
            return `<link ${before}${newUrl}${after}>`;
          } catch {
            return match;
          }
        }
      );
    } catch {
      return html;
    }
  }

  /**
   * Script taglerini düzelt
   */
  private rewriteScriptLinks(html: string): string {
    try {
      return html.replace(
        /<script\s+([^>]*src=["']?)([^"'\s>]+)(["']?[^>]*)>/gi,
        (match, before, url, after) => {
          try {
            const newUrl = this.resolveAssetUrl(url, 'js');
            return `<script ${before}${newUrl}${after}>`;
          } catch {
            return match;
          }
        }
      );
    } catch {
      return html;
    }
  }

  /**
   * Image taglerini düzelt
   */
  private rewriteImageLinks(html: string): string {
    try {
      // img src
      let result = html.replace(
        /<img\s+([^>]*src=["']?)([^"'\s>]+)(["']?[^>]*)>/gi,
        (match, before, url, after) => {
          try {
            const newUrl = this.resolveAssetUrl(url, 'images');
            return `<img ${before}${newUrl}${after}>`;
          } catch {
            return match;
          }
        }
      );

      // img srcset
      result = result.replace(
        /srcset=["']([^"']+)["']/gi,
        (match, srcset) => {
          try {
            const newSrcset = srcset.split(',').map((item: string) => {
              const parts = item.trim().split(/\s+/);
              if (parts[0]) {
                try {
                  parts[0] = this.resolveAssetUrl(parts[0], 'images');
                } catch {}
              }
              return parts.join(' ');
            }).join(', ');
            return `srcset="${newSrcset}"`;
          } catch {
            return match;
          }
        }
      );

      return result;
    } catch {
      return html;
    }
  }

  /**
   * Anchor (a href) linklerini düzelt
   */
  private rewriteAnchorLinks(html: string): string {
    try {
      return html.replace(
        /<a\s+([^>]*href=["']?)([^"'\s>]+)(["']?[^>]*)>/gi,
        (match, before, url, after) => {
          try {
            // External link veya anchor ise dokunma
            if (url.startsWith('#') || url.startsWith('mailto:') || url.startsWith('tel:')) {
              return match;
            }

            // Same domain değilse dokunma
            if (this.isExternalUrl(url)) {
              return match;
            }

            const newUrl = this.resolvePageUrl(url);
            return `<a ${before}${newUrl}${after}>`;
          } catch {
            return match;
          }
        }
      );
    } catch {
      return html;
    }
  }

  /**
   * Inline style içindeki url() fonksiyonlarını düzelt
   */
  private rewriteInlineStyles(html: string): string {
    try {
      return html.replace(
        /style=["']([^"']*)["']/gi,
        (match, styleContent) => {
          try {
            const newStyle = styleContent.replace(
              /url\s*\(\s*["']?([^"')]+)["']?\s*\)/gi,
              (urlMatch: string, url: string) => {
                try {
                  const newUrl = this.resolveAssetUrl(url, 'images');
                  return `url('${newUrl}')`;
                } catch {
                  return urlMatch;
                }
              }
            );
            return `style="${newStyle}"`;
          } catch {
            return match;
          }
        }
      );
    } catch {
      return html;
    }
  }

  /**
   * Asset URL'ini çöz (CSS, JS, images için)
   */
  private resolveAssetUrl(url: string, assetType: string): string {
    // Data URL, blob URL veya empty ise dokunma
    if (!url || url.startsWith('data:') || url.startsWith('blob:')) {
      return url;
    }

    // Normalize URL
    let fullUrl: string;
    try {
      if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
        fullUrl = url.startsWith('//') ? `https:${url}` : url;
      } else {
        fullUrl = new URL(url, this.baseUrl).href;
      }
    } catch {
      return url;
    }

    // Asset map'te var mı kontrol et
    if (this.assetMap.has(fullUrl)) {
      const assetPath = this.assetMap.get(fullUrl)!;
      return this.getRelativePath(assetPath);
    }

    // Map'te yoksa orijinal URL'i bırak (CDN vb. için)
    return url;
  }

  /**
   * Page URL'ini çöz (a href için)
   */
  private resolvePageUrl(url: string): string {
    // Anchor veya special protocol ise dokunma
    if (url.startsWith('#') || url.startsWith('mailto:') || url.startsWith('tel:')) {
      return url;
    }

    // Absolute URL'e çevir
    let fullUrl: string;
    try {
      if (url.startsWith('http://') || url.startsWith('https://')) {
        fullUrl = url;
      } else if (url.startsWith('//')) {
        fullUrl = `https:${url}`;
      } else {
        fullUrl = new URL(url, this.baseUrl).href;
      }
    } catch {
      return url;
    }

    // External URL ise dokunma
    if (this.isExternalUrl(fullUrl)) {
      return url;
    }

    // HTML path'i bul
    if (this.assetMap.has(fullUrl)) {
      const htmlPath = this.assetMap.get(fullUrl)!;
      return this.getRelativePath(htmlPath);
    }

    // Map'te yoksa relative path oluştur
    const urlObj = new URL(fullUrl);
    let pathname = urlObj.pathname;
    if (pathname.endsWith('/')) {
      pathname += 'index.html';
    } else if (!pathname.includes('.')) {
      pathname += '.html';
    }
    return '.' + pathname;
  }

  /**
   * İki path arasında relative path hesapla
   */
  private getRelativePath(targetPath: string): string {
    // Her iki path'i de normalize et
    const from = this.currentPagePath.split('/').filter(Boolean);
    const to = targetPath.split('/').filter(Boolean);

    // Ortak prefix'i bul
    let commonLength = 0;
    const minLength = Math.min(from.length, to.length);
    for (let i = 0; i < minLength - 1; i++) {
      if (from[i] === to[i]) {
        commonLength = i + 1;
      } else {
        break;
      }
    }

    // Relative path oluştur
    const up = from.length - commonLength - 1;
    const down = to.slice(commonLength);

    const parts = [...Array(up).fill('..'), ...down];
    return parts.length > 0 ? parts.join('/') : './' + to[to.length - 1];
  }

  /**
   * URL'in external olup olmadığını kontrol et
   */
  private isExternalUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      const baseObj = new URL(this.baseUrl);
      return urlObj.hostname !== baseObj.hostname;
    } catch {
      return false;
    }
  }
}
