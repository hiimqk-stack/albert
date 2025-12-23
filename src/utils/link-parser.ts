import { Page } from 'playwright';

export class LinkParser {
  /**
   * Sayfadaki tüm linkleri çıkar
   */
  async extractLinks(page: Page, baseUrl: string): Promise<string[]> {
    const links = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('a[href]'));
      return anchors.map(a => (a as HTMLAnchorElement).href);
    });

    // Absolute URL'lere dönüştür ve temizle
    const absoluteLinks = links
      .map(link => {
        try {
          return new URL(link, baseUrl).href;
        } catch {
          return null;
        }
      })
      .filter((link): link is string => link !== null);

    // Unique hale getir
    return [...new Set(absoluteLinks)];
  }

  /**
   * URL'in aynı domain'de olup olmadığını kontrol et
   */
  isSameDomain(url: string, baseUrl: string): boolean {
    try {
      const urlObj = new URL(url);
      const baseObj = new URL(baseUrl);
      return urlObj.hostname === baseObj.hostname;
    } catch {
      return false;
    }
  }

  /**
   * URL'in pattern'lere uyup uymadığını kontrol et
   */
  matchesPatterns(url: string, patterns: RegExp[]): boolean {
    return patterns.some(pattern => pattern.test(url));
  }

  /**
   * Filtrelenmiş linkleri döndür
   */
  filterLinks(
    links: string[],
    baseUrl: string,
    options: {
      sameDomainOnly?: boolean;
      excludePatterns?: RegExp[];
      includePatterns?: RegExp[];
    }
  ): string[] {
    return links.filter(link => {
      // Same domain kontrolü
      if (options.sameDomainOnly && !this.isSameDomain(link, baseUrl)) {
        return false;
      }

      // Exclude patterns
      if (options.excludePatterns?.length && 
          this.matchesPatterns(link, options.excludePatterns)) {
        return false;
      }

      // Include patterns
      if (options.includePatterns?.length && 
          !this.matchesPatterns(link, options.includePatterns)) {
        return false;
      }

      return true;
    });
  }
}
