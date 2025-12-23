#!/usr/bin/env python3
"""
Basit URL değiştirme - String replacement ile TÜM HTTPS URL'leri düzelt
"""

from pathlib import Path
import re

def simple_fix(html_file):
    """HTML'deki tüm HTTPS URL'leri local path'e çevir"""
    
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # 1. <base> tag'ini kaldır
    content = re.sub(r'<base\s+href=["\']https?://[^"\']+["\'][^>]*>\s*', '', content, flags=re.IGNORECASE)
    
    # 2. Protocol-relative URL'leri düzelt
    content = content.replace('//cdn.maxwin580.com/', '../cdn.maxwin580.com/assets/')
    content = content.replace('//service.j72t3w6u6c.com/', '../service.j72t3w6u6c.com/assets/')
    content = content.replace('//sport.maxsportsonline.com/', '../sport.maxsportsonline.com/assets/')
    
    # 3. HTTPS URL'leri düzelt
    content = content.replace('https://cdn.maxwin580.com/', '../cdn.maxwin580.com/assets/')
    content = content.replace('https://service.j72t3w6u6c.com/', '../service.j72t3w6u6c.com/assets/')
    content = content.replace('https://sport.maxsportsonline.com/', '../sport.maxsportsonline.com/assets/')
    
    # 4. HTTP URL'leri düzelt (eski protokol)
    content = content.replace('http://cdn.maxwin580.com/', '../cdn.maxwin580.com/assets/')
    content = content.replace('http://service.j72t3w6u6c.com/', '../service.j72t3w6u6c.com/assets/')
    content = content.replace('http://sport.maxsportsonline.com/', '../sport.maxsportsonline.com/assets/')
    
    # Değişti mi?
    if content != original:
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    maxwin_dir = Path('/Users/kantlori/Desktop/musa/crawled/maxwin580.com')
    
    # Sadece ana dizindeki HTML'leri düzelt
    html_files = [
        maxwin_dir / 'index.html',
        maxwin_dir / 'tr.html',
        maxwin_dir / 'en.html',
        maxwin_dir / 'registration.html',
        maxwin_dir / 'promotions.html',
        maxwin_dir / 'esport.html',
    ]
    
    # Alt dizinlerdeki HTML'leri de ekle
    html_files.extend(list(maxwin_dir.glob('**/*.html')))
    
    print(f"\n{'='*60}")
    print(f"Basit String Replacement Fix")
    print(f"{'='*60}\n")
    
    fixed = 0
    for html in html_files:
        if html.exists():
            try:
                if simple_fix(html):
                    fixed += 1
                    print(f"✓ {html.relative_to(maxwin_dir)}")
            except Exception as e:
                print(f"✗ {html.name}: {e}")
    
    print(f"\n{'='*60}")
    print(f"✅ {fixed} dosya güncellendi")
    print(f"{'='*60}\n")

if __name__ == '__main__':
    main()
