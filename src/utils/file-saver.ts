import { writeFile, mkdir } from 'fs/promises';
import { join, dirname, extname } from 'path';
import { createHash } from 'crypto';
import { ResourceType } from '../types.js';

export class FileSaver {
  private offlineMode: boolean;
  private baseUrl: string;

  constructor(private outputDir: string, offlineMode: boolean = false, baseUrl?: string) {
    this.offlineMode = offlineMode;
    this.baseUrl = baseUrl || '';
  }

  /**
   * Dosya tipini belirle (URL ve content-type'a göre)
   */
  getResourceType(url: string, contentType?: string): ResourceType {
    const ext = extname(new URL(url).pathname).toLowerCase();
    
    // Content-Type kontrolü
    if (contentType) {
      if (contentType.includes('text/html')) return ResourceType.HTML;
      if (contentType.includes('text/css')) return ResourceType.CSS;
      if (contentType.includes('javascript')) return ResourceType.JS;
      if (contentType.includes('image/')) return ResourceType.IMAGE;
      if (contentType.includes('font/') || contentType.includes('woff')) return ResourceType.FONT;
      if (contentType.includes('video/') || contentType.includes('audio/')) return ResourceType.MEDIA;
    }

    // Extension kontrolü
    const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.ico', '.bmp'];
    const cssExts = ['.css'];
    const jsExts = ['.js', '.mjs', '.jsx', '.ts', '.tsx'];
    const fontExts = ['.woff', '.woff2', '.ttf', '.otf', '.eot'];
    const mediaExts = ['.mp4', '.webm', '.mp3', '.wav', '.ogg'];

    if (imageExts.includes(ext)) return ResourceType.IMAGE;
    if (cssExts.includes(ext)) return ResourceType.CSS;
    if (jsExts.includes(ext)) return ResourceType.JS;
    if (fontExts.includes(ext)) return ResourceType.FONT;
    if (mediaExts.includes(ext)) return ResourceType.MEDIA;

    return ResourceType.OTHER;
  }

  /**
   * URL'den güvenli dosya adı oluştur
   */
  sanitizeFileName(url: string, preservePath: boolean = false): string {
    try {
      const urlObj = new URL(url);
      let pathname = urlObj.pathname;

      // Ana sayfa için index.html
      if (pathname === '/' || pathname === '') {
        pathname = '/index.html';
      }

      // Trailing slash varsa index.html ekle
      if (pathname.endsWith('/')) {
        pathname += 'index.html';
      }

      // Extension yoksa .html ekle (HTML dosyaları için)
      if (!extname(pathname)) {
        pathname += '.html';
      }

      // İlk slash'i kaldır
      pathname = pathname.replace(/^\//, '');

      // Offline mode: Path yapısını koru
      if (preservePath || this.offlineMode) {
        // Sadece güvenli olmayan karakterleri değiştir
        pathname = pathname.replace(/[<>:"|?*\\]/g, '_');
        return pathname;
      }

      // Normal mode: Flat yapı, tüm özel karakterleri değiştir
      pathname = pathname.replace(/[^a-zA-Z0-9._\-\/]/g, '_');
      return pathname;
    } catch {
      // Geçersiz URL ise hash kullan
      const hash = createHash('md5').update(url).digest('hex');
      return `${hash}.bin`;
    }
  }

  /**
   * Dosyayı diske kaydet
   */
  async saveFile(
    url: string,
    content: Buffer | string,
    contentType?: string
  ): Promise<string> {
    if (this.offlineMode) {
      // Offline mode: Assets klasörüne kaydet, hostname ile
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.replace(/[^a-zA-Z0-9.-]/g, '_');
      const pathname = this.sanitizeFileName(url, true);
      
      const filePath = join(this.outputDir, hostname, 'assets', pathname);
      await mkdir(dirname(filePath), { recursive: true });
      await writeFile(filePath, content);
      
      return filePath;
    } else {
      // Normal mode: Tip bazlı klasörler
      const resourceType = this.getResourceType(url, contentType);
      const fileName = this.sanitizeFileName(url);
      const filePath = join(this.outputDir, resourceType, fileName);

      await mkdir(dirname(filePath), { recursive: true });
      await writeFile(filePath, content);

      return filePath;
    }
  }

  /**
   * HTML içeriğini kaydet
   */
  async saveHtml(url: string, html: string): Promise<string> {
    if (this.offlineMode) {
      // Offline mode: URL path yapısını koru
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.replace(/[^a-zA-Z0-9.-]/g, '_');
      const pathname = this.sanitizeFileName(url, true);
      
      const filePath = join(this.outputDir, hostname, pathname);
      await mkdir(dirname(filePath), { recursive: true });
      await writeFile(filePath, html, 'utf-8');
      
      return filePath;
    } else {
      // Normal mode: html klasörüne kaydet
      const fileName = this.sanitizeFileName(url);
      const filePath = join(this.outputDir, ResourceType.HTML, fileName);

      await mkdir(dirname(filePath), { recursive: true });
      await writeFile(filePath, html, 'utf-8');

      return filePath;
    }
  }
}
