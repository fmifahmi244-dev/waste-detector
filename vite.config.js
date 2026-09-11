// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],

//   server: {
//     headers: {
//       'Cross-Origin-Opener-Policy': 'same-origin',
//       'Cross-Origin-Embedder-Policy': 'require-corp',
//     },
//   },
// })

import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    allowedHosts: ['gorgeous-unfair-craziness.ngrok-free.dev'],
    // atau kalau mau allow semua ngrok host:
    // allowedHosts: true,
  }
})