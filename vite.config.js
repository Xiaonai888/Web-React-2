import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const buildVersion = `${Date.now()}`

function appVersionPlugin() {
  return {
    name: 'shadow-app-version',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'app-version.json',
        source: JSON.stringify({ version: buildVersion }),
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), appVersionPlugin()],
  define: {
    __APP_BUILD_VERSION__: JSON.stringify(buildVersion),
  },
})
