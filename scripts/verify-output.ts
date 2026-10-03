import { access, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const publicDir = resolve('static');
const sourceHtml = await readFile('index.html', 'utf8');
const html = await readFile(resolve(publicDir, 'index.html'), 'utf8');
const firebaseConfig: unknown = JSON.parse(await readFile('firebase.json', 'utf8'));
const jsonLd = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
const hosting = getHosting(firebaseConfig);

const checks: Array<[string, boolean]> = [
  ['Firebase publica el directorio static/', hosting?.public === 'static'],
  ['La página HTML en español está compilada', html.includes('<html lang="es"')],
  ['La foto del hero está enlazada correctamente', html.includes('src="/images/equipo-linces.jpeg"')],
  ['El carrusel retirado no aparece en el HTML', !html.includes('carousel-slides') && !html.includes('carousel-toggle') && !html.includes('carousel-indicator')],
  ['El HTML fuente usa rutas portables', !sourceHtml.includes('href="/tailwind.css"') && sourceHtml.includes('href="static/tailwind.css"')],
  ['La página de bienvenida de Firebase fue reemplazada', !html.includes('Welcome to Firebase Hosting')],
  ['La aplicación compilada está enlazada', html.includes('src="/app.js"')],
  ['La página 404 está publicada', await exists(resolve(publicDir, '404.html'))],
  ['robots.txt está publicado', await exists(resolve(publicDir, 'robots.txt'))],
  ['sitemap.xml está publicado', await exists(resolve(publicDir, 'sitemap.xml'))],
  ['Los datos estructurados son JSON válido', isValidJson(jsonLd)],
  ['El logo original está excluido del deploy', hosting?.ignore.includes('images/LOGO-LPS.png') ?? false],
  ['El icono original está excluido del deploy', hosting?.ignore.includes('icons/REDONDEADO-LPS-LOGO.png') ?? false],
];

const sourcePaths = [...sourceHtml.matchAll(/(?:src|href)="static\/([^"?#]+)["?]/g)]
  .map((match) => match[1]);
const sourcePathsExist = await Promise.all([...new Set(sourcePaths)].map((path) =>
  exists(resolve('static', path))));
checks.push(['Los recursos de vista local existen', sourcePathsExist.every(Boolean)]);

const localPaths = [...html.matchAll(/(?:src|href)="\/(?!\/)([^"?#]+)["?]/g)]
  .map((match) => match[1]);
for (const path of new Set(localPaths)) {
  checks.push([`Existe el recurso publicado /${path}`, await exists(resolve(publicDir, path))]);
}

for (const stylesheet of ['style.css', 'css/all.min.css', 'css/local-fonts.css']) {
  const css = await readFile(resolve(publicDir, stylesheet), 'utf8');
  const resources = [...css.matchAll(/url\((?:"|')?(.*?)(?:"|')?\)/g)]
    .map((match) => match[1])
    .filter((path) => path && !path.startsWith('data:'));
  const resourcesExist = await Promise.all(resources.map((resource) =>
    exists(resolve(publicDir, dirname(stylesheet), resource))));
  checks.push([`Los recursos de ${stylesheet} existen (${resources.length})`, resourcesExist.every(Boolean)]);
}

const failures: string[] = [];
for (const [label, passed] of checks) {
  console.log(`${passed ? '  ✓' : '  ✗'} ${label}`);
  if (!passed) failures.push(label);
}

console.log('');
if (failures.length > 0) {
  console.error(`Build incompleto: ${failures.length} de ${checks.length} verificaciones fallaron.`);
  process.exitCode = 1;
} else {
  console.log(`Build correcto: ${checks.length} verificaciones aprobadas. El sitio está listo para publicar.`);
}

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function isValidJson(value: string | undefined): boolean {
  if (!value) return false;
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}

function getHosting(value: unknown): { public: string; ignore: string[] } | null {
  if (typeof value !== 'object' || value === null || !('hosting' in value)) return null;
  const hostingConfig = value.hosting;
  if (typeof hostingConfig !== 'object' || hostingConfig === null || !('public' in hostingConfig) || !('ignore' in hostingConfig)) return null;
  const { public: publicDirName, ignore } = hostingConfig;
  if (typeof publicDirName !== 'string' || !Array.isArray(ignore) || !ignore.every((item) => typeof item === 'string')) return null;
  return { public: publicDirName, ignore };
}
