#!/usr/bin/env python3
"""
Crawled klasöründeki HTML dosyalarının yollarını ve yönlendirmelerini düzeltir.
Kodları değiştirmez, sadece asset ve link yollarını yerelleştirir.
"""

import os
import re
from pathlib import Path
from urllib.parse import urlparse, urljoin

class CrawledSiteFixer:
    def __init__(self, crawled_dir):
        self.crawled_dir = Path(crawled_dir)
        self.main_domain = "maxwin580.com"
        self.stats = {
            'files_processed': 0,
            'links_fixed': 0,
            'assets_fixed': 0,
            'errors': []
        }
    
    def get_relative_path(self, from_file, to_file):
        """İki dosya arasındaki göreceli yolu hesapla"""
        try:
            from_path = Path(from_file).parent
            to_path = Path(to_file)
            return os.path.relpath(to_path, from_path)
        except:
            return to_file
    
    def fix_external_asset_path(self, url, current_file):
        """External CDN ve asset URL'lerini local pathlere çevir"""
        if not url or url.startswith('#') or url.startswith('data:') or url.startswith('blob:'):
            return url
        
        # Protocol-relative URL'leri düzelt (//domain.com/path)
        if url.startswith('//'):
            url = 'https:' + url
        
        # Parse URL
        parsed = urlparse(url)
        
        # Eğer protokol yoksa zaten local path olabilir
        if not parsed.scheme and not parsed.netloc:
            return url
        
        # Domain'i al
        domain = parsed.netloc
        if not domain:
            return url
        
        # Local crawled klasöründe bu domain var mı?
        domain_dir = self.crawled_dir / domain
        if domain_dir.exists():
            # Path'i oluştur (query parametrelerini IGNORE et)
            path_without_query = parsed.path.lstrip('/')
            
            # 1. Query parametresiz direkt dene
            local_file = domain_dir / path_without_query
            if local_file.exists():
                rel_path = self.get_relative_path(current_file, local_file)
                self.stats['assets_fixed'] += 1
                return rel_path
            
            # 2. Assets/ prefix ile dene
            local_file_with_assets = domain_dir / "assets" / path_without_query
            if local_file_with_assets.exists():
                rel_path = self.get_relative_path(current_file, local_file_with_assets)
                self.stats['assets_fixed'] += 1
                return rel_path
        
        # Bulunamadıysa orijinal URL'i bırak (external kalacak)
        return url
    
    def fix_internal_link(self, url, current_file):
        """Internal navigation linklerini düzelt"""
        if not url or url.startswith('#') or url.startswith('http') or url.startswith('//'):
            return url
        
        # Absolute path'i relative'e çevir
        if url.startswith('/'):
            main_domain_dir = self.crawled_dir / self.main_domain
            target_path = main_domain_dir / url.lstrip('/')
            
            if target_path.exists():
                rel_path = self.get_relative_path(current_file, target_path)
                self.stats['links_fixed'] += 1
                return rel_path
        
        return url
    
    def process_html_file(self, html_file):
        """Bir HTML dosyasını işle"""
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            
            # 0. <base> tag'ini kaldır veya düzelt
            content = re.sub(r'<base\s+href=["\']https?://[^"\']+["\'][^>]*>', '', content)
            
            # 1. Script src düzelt (tüm varyasyonlar)
            def fix_script_src(match):
                full_tag = match.group(0)
                src_value = match.group(1)
                fixed = self.fix_external_asset_path(src_value, html_file)
                return full_tag.replace(src_value, fixed)
            
            content = re.sub(r'<script[^>]+src=["\']([^"\']+)["\']', fix_script_src, content)
            
            # 2. Link href düzelt (CSS ve preload)
            def fix_link_href(match):
                full_tag = match.group(0)
                href_value = match.group(1)
                
                # CSS, preload, icon gibi asset'ler
                if 'stylesheet' in full_tag or 'preload' in full_tag or 'icon' in full_tag or 'manifest' in full_tag:
                    fixed = self.fix_external_asset_path(href_value, html_file)
                else:
                    # Navigation link
                    fixed = self.fix_internal_link(href_value, html_file)
                
                return full_tag.replace(href_value, fixed)
            
            content = re.sub(r'<link[^>]+href=["\']([^"\']+)["\']', fix_link_href, content)
            
            # 3. A href düzelt (navigation)
            def fix_a_href(match):
                original = match.group(1)
                fixed = self.fix_internal_link(original, html_file)
                return f'<a href="{fixed}"'
            
            content = re.sub(r'<a\s+href="([^"]+)"', fix_a_href, content)
            content = re.sub(r'<a\s+([^>]*\s+)href="([^"]+)"', lambda m: f'<a {m.group(1)}href="{self.fix_internal_link(m.group(2), html_file)}"', content)
            
            # 4. Img src düzelt
            def fix_img_src(match):
                full_tag = match.group(0)
                src_value = match.group(1)
                fixed = self.fix_external_asset_path(src_value, html_file)
                return full_tag.replace(src_value, fixed)
            
            content = re.sub(r'<img[^>]+src=["\']([^"\']+)["\']', fix_img_src, content)
            
            # 5. Background image düzelt (CSS içinde)
            def fix_bg_image(match):
                original = match.group(1)
                fixed = self.fix_external_asset_path(original, html_file)
                return f'url({fixed})'
            
            content = re.sub(r'url\(["\']?([^"\')\s]+)["\']?\)', fix_bg_image, content)
            
            # 6. Data-src, data-srcset düzelt (lazy loading)
            content = re.sub(r'data-src="([^"]+)"', lambda m: f'data-src="{self.fix_external_asset_path(m.group(1), html_file)}"', content)
            content = re.sub(r'data-srcset="([^"]+)"', lambda m: f'data-srcset="{self.fix_external_asset_path(m.group(1), html_file)}"', content)
            
            # 7. srcset düzelt
            def fix_srcset(match):
                srcset = match.group(1)
                parts = srcset.split(',')
                fixed_parts = []
                for part in parts:
                    part = part.strip()
                    if ' ' in part:
                        url, descriptor = part.rsplit(' ', 1)
                        fixed_url = self.fix_external_asset_path(url, html_file)
                        fixed_parts.append(f"{fixed_url} {descriptor}")
                    else:
                        fixed_parts.append(self.fix_external_asset_path(part, html_file))
                return f'srcset="{", ".join(fixed_parts)}"'
            
            content = re.sub(r'srcset="([^"]+)"', fix_srcset, content)
            
            # Eğer değişiklik olduysa dosyayı kaydet
            if content != original_content:
                with open(html_file, 'w', encoding='utf-8') as f:
                    f.write(content)
                self.stats['files_processed'] += 1
                print(f"✓ Fixed: {html_file.relative_to(self.crawled_dir)}")
            else:
                print(f"○ No changes: {html_file.relative_to(self.crawled_dir)}")
        
        except Exception as e:
            error_msg = f"Error processing {html_file}: {str(e)}"
            self.stats['errors'].append(error_msg)
            print(f"✗ {error_msg}")
    
    def process_all_html_files(self):
        """Crawled klasöründeki tüm HTML dosyalarını işle"""
        html_files = list(self.crawled_dir.rglob('*.html')) + list(self.crawled_dir.rglob('*.htm'))
        
        print(f"\n{'='*60}")
        print(f"Found {len(html_files)} HTML files to process")
        print(f"{'='*60}\n")
        
        for html_file in html_files:
            self.process_html_file(html_file)
        
        # İstatistikleri yazdır
        print(f"\n{'='*60}")
        print("SUMMARY")
        print(f"{'='*60}")
        print(f"Files processed: {self.stats['files_processed']}")
        print(f"Links fixed: {self.stats['links_fixed']}")
        print(f"Assets fixed: {self.stats['assets_fixed']}")
        print(f"Errors: {len(self.stats['errors'])}")
        
        if self.stats['errors']:
            print("\nErrors:")
            for error in self.stats['errors'][:10]:
                print(f"  - {error}")
            if len(self.stats['errors']) > 10:
                print(f"  ... and {len(self.stats['errors']) - 10} more")
        
        print(f"\n✓ Site is now ready to use!")
        print(f"  Open: {self.crawled_dir / self.main_domain / 'index.html'}")

def main():
    script_dir = Path(__file__).parent
    crawled_dir = script_dir / 'crawled'
    
    if not crawled_dir.exists():
        print(f"Error: crawled directory not found at {crawled_dir}")
        return
    
    fixer = CrawledSiteFixer(crawled_dir)
    fixer.process_all_html_files()

if __name__ == '__main__':
    main()
