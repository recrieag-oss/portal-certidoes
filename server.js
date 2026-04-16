'use strict';

// Force correct working directory — must be before any require('next')
process.chdir(__dirname);
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.PORT     = process.env.PORT     || '3000';

const { createServer } = require('http');
const { parse }        = require('url');
const next             = require('next');

const port = parseInt(process.env.PORT, 10) || 3000;

// dir: __dirname ensures Next.js always resolves .next/ relative to THIS file,
// regardless of what working directory Passenger sets before launch.
const app    = next({ dev: false, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    createServer(async (req, res) => {
      try {
        await handle(req, res, parse(req.url, true));
      } catch (err) {
        console.error('Error handling', req.url, err);
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    }).listen(port, '0.0.0.0', () => {
      console.log(`> Next.js ready on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Failed to start Next.js server:', err);
    process.exit(1);
  });
