// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
    site: 'https://maxwin584.com',
    output: 'static',
    adapter: cloudflare(),
    build: {
        assets: 'assets'
    },
    vite: {
        build: {
            assetsInlineLimit: 0
        }
    }
});
