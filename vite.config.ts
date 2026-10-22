import { existsSync, readFileSync } from 'node:fs'
import { parseEnv } from 'node:util'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Same files and order as Vite's own env loading. Read straight from disk on purpose:
// loadEnv lets values already in process.env win, so a stale key in a long-running
// dev server would shadow the one just saved to .env.
function readEnvFiles(mode: string) {
  const env: Record<string, string | undefined> = {}
  for (const file of ['.env', '.env.local', `.env.${mode}`, `.env.${mode}.local`]) {
    if (existsSync(file)) Object.assign(env, parseEnv(readFileSync(file, 'utf8')))
  }
  return env
}

// Vercel runs api/contact.ts in production. This serves the same function during
// `npm run dev`, with the server-only variables from .env, so the form works locally too.
function contactApi(): Plugin {
  return {
    name: 'contact-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/contact', async (req, res, next) => {
        if (req.method !== 'POST') return next()
        try {
          const chunks: Buffer[] = []
          for await (const chunk of req) chunks.push(chunk as Buffer)
          // Read .env on every request so a newly pasted key works without restarting
          const env = { ...process.env, ...readEnvFiles(server.config.mode) }
          const { handleContact } = await server.ssrLoadModule('/api/contact.ts')
          const response: Response = await handleContact(
            new Request('http://localhost/api/contact', {
              method: 'POST',
              headers: { 'content-type': 'application/json' },
              body: Buffer.concat(chunks),
            }),
            env,
          )
          res.statusCode = response.status
          res.setHeader('content-type', 'application/json')
          res.end(await response.text())
        } catch (error) {
          next(error)
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    contactApi(),
  ],
})
