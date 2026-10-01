import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.resolve(import.meta.dirname, 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

function planoIaBackendPlugin() {
  return {
    name: 'planoia-backend-api',
    configureServer(server: any) {
      server.middlewares.use('/api/state', (req: any, res: any, next: any) => {
        res.setHeader('Content-Type', 'application/json');
        if (req.method === 'GET') {
          try {
            if (fs.existsSync(STORE_FILE)) {
              const raw = fs.readFileSync(STORE_FILE, 'utf-8');
              res.statusCode = 200;
              res.end(raw);
              return;
            }
            res.statusCode = 200;
            res.end(JSON.stringify({ initialized: false }));
          } catch (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Failed to read state' }));
          }
          return;
        }

        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              if (!fs.existsSync(DATA_DIR)) {
                fs.mkdirSync(DATA_DIR, { recursive: true });
              }
              JSON.parse(body); // validate JSON
              fs.writeFileSync(STORE_FILE, body, 'utf-8');
              res.statusCode = 200;
              res.end(JSON.stringify({ ok: true }));
            } catch (err) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), planoIaBackendPlugin()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    allowedHosts: true,
  },
});
