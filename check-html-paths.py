#!/usr/bin/env python3
"""
HTML dosyasını analiz eder ve hangi kaynakların yüklenip yüklenmediğini gösterir
"""

import sys
import re
from pathlib import Path
from urllib.parse import urlparse

def analyze_html(html_file):
    with open(html_file, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    print(f"\n{'='*60}")
    print(f"Analyzing: {html_file}")
    print(f"{'='*60}\n")
    
    # Script tags
    scripts = re.findall(r'<script[^>]+src=["\']([^"\']+)["\']', content)
    print(f"📜 SCRIPTS ({len(scripts)} found):")
    for i, src in enumerate(scripts[:10], 1):
        parsed = urlparse(src)
        if parsed.scheme in ['http', 'https']:
            print(f"  {i}. ⚠️  EXTERNAL: {src[:80]}")
        elif src.startswith('//'):
            print(f"  {i}. ⚠️  PROTOCOL-RELATIVE: {src[:80]}")
        elif Path(html_file).parent.joinpath(src).exists():
            print(f"  {i}. ✓  LOCAL (exists): {src[:80]}")
        else:
            print(f"  {i}. ✗  LOCAL (missing): {src[:80]}")
    if len(scripts) > 10:
        print(f"  ... and {len(scripts) - 10} more")
    
    # CSS links
    css_links = re.findall(r'<link[^>]+rel=["\']stylesheet["\'][^>]+href=["\']([^"\']+)["\']', content)
    css_links += re.findall(r'<link[^>]+href=["\']([^"\']+)["\'][^>]+rel=["\']stylesheet["\']', content)
    print(f"\n🎨 STYLESHEETS ({len(css_links)} found):")
    for i, href in enumerate(css_links[:10], 1):
        parsed = urlparse(href)
        if parsed.scheme in ['http', 'https']:
            print(f"  {i}. ⚠️  EXTERNAL: {href[:80]}")
        elif href.startswith('//'):
            print(f"  {i}. ⚠️  PROTOCOL-RELATIVE: {href[:80]}")
        elif Path(html_file).parent.joinpath(href).exists():
            print(f"  {i}. ✓  LOCAL (exists): {href[:80]}")
        else:
            print(f"  {i}. ✗  LOCAL (missing): {href[:80]}")
    if len(css_links) > 10:
        print(f"  ... and {len(css_links) - 10} more")
    
    # Images
    images = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', content)
    print(f"\n🖼️  IMAGES ({len(images)} found):")
    for i, src in enumerate(images[:10], 1):
        parsed = urlparse(src)
        if parsed.scheme in ['http', 'https']:
            print(f"  {i}. ⚠️  EXTERNAL: {src[:80]}")
        elif src.startswith('//'):
            print(f"  {i}. ⚠️  PROTOCOL-RELATIVE: {src[:80]}")
        elif src.startswith('data:'):
            print(f"  {i}. ✓  DATA URI (embedded)")
        elif Path(html_file).parent.joinpath(src).exists():
            print(f"  {i}. ✓  LOCAL (exists): {src[:80]}")
        else:
            print(f"  {i}. ✗  LOCAL (missing): {src[:80]}")
    if len(images) > 10:
        print(f"  ... and {len(images) - 10} more")
    
    # Check for external API calls
    api_patterns = [
        r'fetch\(["\']([^"\']+)["\']',
        r'\.get\(["\']([^"\']+)["\']',
        r'\.post\(["\']([^"\']+)["\']',
        r'XMLHttpRequest.*["\']([^"\']+)["\']'
    ]
    
    print(f"\n🌐 POTENTIAL ISSUES:")
    
    # External URLs
    external_count = sum(1 for s in scripts + css_links + images 
                        if urlparse(s).scheme in ['http', 'https'] or s.startswith('//'))
    if external_count > 0:
        print(f"  ⚠️  {external_count} external resources won't load offline")
    
    # Check if page has any content
    if len(content) < 1000:
        print(f"  ⚠️  Page seems very small ({len(content)} bytes) - might be empty")
    
    print(f"\n{'='*60}\n")

if __name__ == '__main__':
    if len(sys.argv) < 2:
        html_file = Path('/Users/kantlori/Desktop/musa/crawled/maxwin580.com/index.html')
    else:
        html_file = Path(sys.argv[1])
    
    if not html_file.exists():
        print(f"❌ File not found: {html_file}")
        sys.exit(1)
    
    analyze_html(html_file)
    
    print("💡 TIP: Tarayıcıda F12 basıp Console'a bak - orada hatalar görünür")
    print("💡 Network tab'ında hangi dosyaların yüklenemediğini görebilirsin")
