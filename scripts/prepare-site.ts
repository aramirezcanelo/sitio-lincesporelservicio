import { copyFile, readFile, rm, writeFile } from 'node:fs/promises';

await copyFile('static/main.js', 'static/app.js');
await rm('static/main.js', { force: true });

const sourceHtml = await readFile('index.html', 'utf8');
const hostedHtml = sourceHtml.replace(/((?:href|src)=")static\//g, '$1/');
await writeFile('static/index.html', hostedHtml);
await Promise.all([
  copyFile('robots.txt', 'static/robots.txt'),
  copyFile('sitemap.xml', 'static/sitemap.xml'),
]);
