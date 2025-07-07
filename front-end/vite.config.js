import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { viteStaticCopy } from 'vite-plugin-static-copy'
const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig(() => {
  return {
    plugins: [
      nodePolyfills(),
      viteStaticCopy({
        targets: [
          {
            src: 'docs',
            dest: '.',
          },
        ],
      }),
    ],
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          docs: resolve(__dirname, 'docs/index.html'),
        },
      },
    },
    base: './',
  }
})
