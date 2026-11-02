import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { VitePWA } from 'vite-plugin-pwa';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';

// Publishes /links.json (id + url only) so the Worker's weekly link checker knows what to test.
const linksJson = () => ({
  name: 'links-json',
  generateBundle(this: any) {
    const links = parse(readFileSync('content/links.yaml', 'utf8')) as { id: string; url: string }[];
    this.emitFile({ type: 'asset', fileName: 'links.json', source: JSON.stringify(links.map(({ id, url }) => ({ id, url }))) });
  }
});

export default defineConfig({
  plugins: [
    preact(),
    linksJson(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'Paisa Sense',
        short_name: 'Paisa Sense',
        description: 'Practical personal finance for India: learn, practise, remember.',
        theme_color: '#0f766e',
        background_color: '#0b1514',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' },
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}']
      }
    })
  ],
  test: { environment: 'node' }
} as any);
