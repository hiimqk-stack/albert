#!/usr/bin/env python3
"""
HTML'deki external kaynakları detaylı analiz eder ve local eşleşmeleri bulur
"""

import re
from pathlib import Path
from urllib.parse import urlparse, parse_qs

def analyze_missing_resources():
    html_file = Path('/Users/kantlori/Desktop/musa/crawled/maxwin580.com/index.html')
    crawled_dir = Path('/Users/kantlori/Desktop/musa/crawled')
    
    with open(html_file, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    # External CSS'leri bul
    css_links = re.findall(r'<link[^>]+rel=["\']stylesheet["\'][^>]+href=["\']([^"\']+)["\']', content)
    css_links += re.findall(r'<link[^>]+href=["\']([^"\']+)["\'][^>]+rel=["\']stylesheet["\']', content)
    
    # External JS'leri bul
    scripts = re.findall(r'<script[^>]+src=["\']([^"\']+)["\']', content)
    
    print(f"\n{'='*80}")
    print(f"DETAYLI KAYNAK ANALİZİ")
    print(f"{'='*80}\n")
    
    # CSS Analizi
    print(f"📋 CSS DOSYALARI ANALİZİ:\n")
    external_css = [css for css in css_links if css.startswith('http') or css.startswith('//')]
    
    for i, css_url in enumerate(external_css, 1):
        if css_url.startswith('//'):
            css_url = 'https:' + css_url
        
        parsed = urlparse(css_url)
        domain = parsed.netloc
        path_without_query = parsed.path.lstrip('/')
        
        print(f"{i}. URL: {css_url[:100]}")
        print(f"   Domain: {domain}")
        print(f"   Path: {path_without_query}")
        
        # Local dosya var mı?
        domain_dir = crawled_dir / domain
        if domain_dir.exists():
            # Query parametresiz dene
            local_file = domain_dir / path_without_query
            local_file_assets = domain_dir / "assets" / path_without_query
            
            if local_file.exists():
                print(f"   ✅ BULUNDU: {local_file.relative_to(crawled_dir)}")
            elif local_file_assets.exists():
                print(f"   ✅ BULUNDU (assets/): {local_file_assets.relative_to(crawled_dir)}")
            else:
                print(f"   ❌ BULUNAMADI")
                # Benzer dosya var mı?
                parent = local_file_assets.parent
                if parent.exists():
                    similar = list(parent.glob(local_file_assets.name.split('?')[0]))
                    if similar:
                        print(f"   💡 Benzer: {similar[0].relative_to(crawled_dir)}")
        else:
            print(f"   ❌ Domain klasörü yok: {domain}")
        print()
    
    # JS Analizi
    print(f"\n📋 JAVASCRIPT DOSYALARI ANALİZİ:\n")
    external_js = [js for js in scripts if js.startswith('http') or js.startswith('//')]
    
    for i, js_url in enumerate(external_js, 1):
        if js_url.startswith('//'):
            js_url = 'https:' + js_url
        
        parsed = urlparse(js_url)
        domain = parsed.netloc
        path_without_query = parsed.path.lstrip('/')
        
        print(f"{i}. URL: {js_url[:100]}")
        print(f"   Domain: {domain}")
        print(f"   Path: {path_without_query}")
        
        # Local dosya var mı?
        domain_dir = crawled_dir / domain
        if domain_dir.exists():
            local_file = domain_dir / path_without_query
            local_file_assets = domain_dir / "assets" / path_without_query
            
            if local_file.exists():
                print(f"   ✅ BULUNDU: {local_file.relative_to(crawled_dir)}")
            elif local_file_assets.exists():
                print(f"   ✅ BULUNDU (assets/): {local_file_assets.relative_to(crawled_dir)}")
            else:
                print(f"   ❌ BULUNAMADI")
                parent = local_file_assets.parent
                if parent.exists():
                    similar = list(parent.glob(local_file_assets.name.split('?')[0]))
                    if similar:
                        print(f"   💡 Benzer: {similar[0].relative_to(crawled_dir)}")
        else:
            print(f"   ❌ Domain klasörü yok: {domain}")
        print()
    
    # Özet
    print(f"\n{'='*80}")
    print(f"ÖZET")
    print(f"{'='*80}")
    print(f"External CSS: {len(external_css)}")
    print(f"External JS: {len(external_js)}")
    print(f"\n💡 Çoğu dosya local'de var ama query parametresi yüzünden eşleşmiyor!")
    print(f"💡 Scripti güncelleyip query parametrelerini ignore etmeliyiz.\n")

if __name__ == '__main__':
    analyze_missing_resources()
