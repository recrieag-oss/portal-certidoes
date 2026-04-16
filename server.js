'use strict';
const path = require('path');
const fs   = require('fs');

// ── Working directory ────────────────────────────────────────────────────────
process.chdir(__dirname);
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.PORT     = process.env.PORT     || '3000';

// ── Diagnostics (visible in cPanel stderr.log) ───────────────────────────────
console.log('[server] __dirname :', __dirname);
console.log('[server] cwd       :', process.cwd());

const buildId = path.join(__dirname, '.next', 'BUILD_ID');
console.log('[server] BUILD_ID  :', buildId);
console.log('[server] exists    :', fs.existsSync(buildId));

// ── Load Next.js from the standalone bundle (avoids nodevenv version issues) ─
// The standalone build ships its own node_modules/next that matches the build.
const standaloneNext = path.join(
  __dirname, '.next', 'standalone', 'node_modules', 'next'
);
console.log('[server] next from :', standaloneNext);
const next = require(standaloneNext);

const { createServer } = require('http');
const { parse }        = require('url');

const port = parseInt(process.env.PORT, 10) || 3000;

// dir: __dirname → Next.js reads .next/ from the project root (where it lives)
const app    = next({ dev: false, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    console.log('[server] Next.js ready, starting HTTP listener…');
    createServer(async (req, res) => {
      try {
        await handle(req, res, parse(req.url, true));
      } catch (err) {
        console.error('[server] Error:', req.url, err);
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    }).listen(port, '0.0.0.0', () => {
      console.log(`[server] Listening on http://0.0.0.0:${port}`);
    });
  })
  .catch(err => {
    console.error('[server] FATAL — failed to prepare Next.js:', err);
    process.exit(1);
  });
