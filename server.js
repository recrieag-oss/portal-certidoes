const fs = require('fs');
const path = require('path');

// Force correct working directory
process.chdir(__dirname);
process.env.PORT = process.env.PORT || '3000';
process.env.HOSTNAME = '0.0.0.0';

// Symlink static assets into standalone directory (required by Next.js standalone)
const standaloneDir = path.join(__dirname, '.next', 'standalone');
const staticSrc  = path.join(__dirname, '.next', 'static');
const staticDest = path.join(standaloneDir, '.next', 'static');
const publicSrc  = path.join(__dirname, 'public');
const publicDest = path.join(standaloneDir, 'public');

function ensureLink(src, dest) {
  try {
    if (!fs.existsSync(dest)) {
      fs.symlinkSync(src, dest, 'dir');
      console.log('Symlinked:', src, '->', dest);
    }
  } catch (e) {
    console.error('Symlink error:', e.message);
  }
}

ensureLink(staticSrc,  staticDest);
ensureLink(publicSrc,  publicDest);

// Launch standalone Next.js server
require('./.next/standalone/server.js');
