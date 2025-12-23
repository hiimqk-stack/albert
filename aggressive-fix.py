#!/usr/bin/env python3
"""
Agresif URL düzeltme - HTML'deki TÜM external URL'leri bulup local path'lere çevirir
"""

import re
from pathlib import Path

def aggressive_fix_html(html_file):
    """Bir HTML dosyasındaki TÜM external URL'leri düzelt"""
    
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    crawled_dir = Path('/Users/kantlori/Desktop/musa/crawled')
    
    # Domain mappings - hangi domain hangi local klasörde
    domain_mappings = {
        'cdn.maxwin580.com': crawled_dir / 'cdn.maxwin580.com/assets',
        'service.j72t3w6u6c.com': crawled_dir / 'service.j72t3w6u6c.com/assets',
        'sport.maxsportsonline.com': crawled_dir / 'sport.maxsportsonline.com/assets',
        'fonts.googleapis.com': None,  # External - skip
    }
    
    def get_relative_path(target_path):
        """HTML dosyasından hedefe göreceli yol"""
        try:
            return '../' + str(target_path.relative_to(crawled_dir))
        except:
            return str(target_path)
    
    def replace_url(match):
        """URL'i local path ile değiştir"""
        full_match = match.group(0)
        url = match.group(1) or match.group(2)  # Capture group'a göre
        
        # Protocol ekle
        if url.startswith('//'):
            url = 'https:' + url
        
        # Skip data: ve blob:
        if url.startswith(('data:', 'blob:', '#')):
            return full_match
        
        # Parse URL
        for domain, local_dir in domain_mappings.items():
            if domain in url:
                if local_dir is None:
                    return full_match  # Skip external (Google Fonts vb)
                
                # Path'i çıkar
                parts = url.split(domain, 1)
                if len(parts) > 1:
                    path = parts[1].lstrip('/')
                    # Query parametrelerini kaldır
                    path = path.split('?')[0]
                    
                    local_file = local_dir / path
                    if local_file.exists():
                        rel_path = get_relative_path(local_file)
                        return full_match.replace(url, rel_path)
        
        return full_match
    
    # 1. <base> tag'ini kaldır
    content = re.sub(r'<base\s+href=["\']https?://[^"\']+["\'][^>]*>', '', content, flags=re.IGNORECASE)
    
    # 2. Tüm href="..." pattern'leri
    content = re.sub(r'href=["\']((https?:)?//[^"\']+)["\']', replace_url, content, flags=re.IGNORECASE)
    
    # 3. Tüm src="..." pattern'leri
    content = re.sub(r'src=["\']((https?:)?//[^"\']+)["\']', replace_url, content, flags=re.IGNORECASE)
    
    # 4. CSS url() fonksiyonları
    content = re.sub(r'url\(["\']?((https?:)?//[^"\')\s]+)["\']?\)', replace_url, content, flags=re.IGNORECASE)
    
    # 5. srcset="..." pattern'leri
    def fix_srcset(match):
        full = match.group(0)
        srcset = match.group(1)
        
        parts = srcset.split(',')
        fixed_parts = []
        for part in parts:
            part = part.strip()
            # URL ve descriptor'ı ayır
            if ' ' in part:
                url_part, desc = part.rsplit(' ', 1)
                fixed_url = replace_url(type('obj', (), {'group': lambda self, n: url_part if n == 1 else None})())
                if fixed_url != url_part:
                    fixed_parts.append(f"{fixed_url} {desc}")
                else:
                    fixed_parts.append(part)
            else:
                fixed_parts.append(part)
        
        return f'srcset="{", ".join(fixed_parts)}"'
    
    content = re.sub(r'srcset=["\']([^"\']+)["\']', fix_srcset, content, flags=re.IGNORECASE)
    
    # Değişiklik varsa kaydet
    if content != original_content:
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    crawled_dir = Path('/Users/kantlori/Desktop/musa/crawled/maxwin580.com')
    
    html_files = list(crawled_dir.rglob('*.html'))
    
    print(f"\n{'='*60}")
    print(f"Agresif URL Düzeltme - {len(html_files)} HTML dosyası")
    print(f"{'='*60}\n")
    
    fixed_count = 0
    for html_file in html_files:
        try:
            if aggressive_fix_html(html_file):
                fixed_count += 1
                print(f"✓ Fixed: {html_file.name}")
        except Exception as e:
            print(f"✗ Error {html_file.name}: {e}")
    
    print(f"\n{'='*60}")
    print(f"Toplam {fixed_count} dosya güncellendi")
    print(f"{'='*60}\n")
    print("✓ Şimdi tarayıcıda Cmd+Shift+R ile hard refresh yap!")

if __name__ == '__main__':
    main()
