import { defineConfig, loadEnv } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: [
      nodePolyfills(),
    ],
    base: `/v1/get_by_attribute/${env.VITE_NEOFS_CONTAINER_ID}/FilePath/`,
  }
})