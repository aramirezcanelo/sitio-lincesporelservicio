import { rm } from 'node:fs/promises';

await Promise.all([
  'static/app.js',
  'static/main.js',
  'static/tailwind.css',
  'static/index.html',
  'static/robots.txt',
  'static/sitemap.xml',
].map((path) => rm(path, { force: true })));
