import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    // json-server rewrites db.json on every mutation; without this the dev
    // page full-reloads after any create/update/delete.
    watch: {
      ignored: ["**/db.json"],
    },
  },
})

