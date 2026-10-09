import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const outputDir = path.join(projectRoot, 'dist');
const dataDir = path.join(projectRoot, 'data');
const sitemapPath = path.join(outputDir, 'sitemap.xml');
const questionsPath = path.join(dataDir, 'questions.json');

const siteOrigin = resolveSiteOrigin();

const staticRoutes = [ '/', '/rules' ];
function resolveSiteOrigin() {
  const envOrigin = (loadEnv('production', projectRoot, 'VITE_').VITE_SITE_URL ?? '').trim();
  return (envOrigin || 'https://lockstock-fanvault.darkselia.ru/').replace(/\/+$/, '');
}
function readEpisodeIds() {
  try {
    const raw = fs.readFileSync(questionsPath, 'utf-8');
    const data = JSON.parse(raw);
    return Object.keys(data ?? {});
  } catch (e) {
    console.warn('Не удалось прочитать data/questions.json. В карту сайта попадут только статические маршруты.');
    return [];
  }
}

function buildUrlEntry(route) {
  const url = `${siteOrigin}${route}`;
  const lastmod = new Date().toISOString();
  return `    <url>\n      <loc>${url}</loc>\n      <lastmod>${lastmod}</lastmod>\n      <changefreq>weekly</changefreq>\n      <priority>${route === '/' ? '1.0' : '0.8'}</priority>\n    </url>`;
}

function generateSitemap() {
  const episodeIds = readEpisodeIds();
  const episodeRoutes = episodeIds.map(id => `/episode/${id}`);
  const routes = [...new Set([ ...staticRoutes, ...episodeRoutes ])]
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const body = routes.map(buildUrlEntry).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(sitemapPath, xml, 'utf-8');
  fs.writeFileSync(
    path.join(outputDir, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${siteOrigin}/sitemap.xml\n`,
    'utf-8',
  );
  const notFoundHtml = fs.readFileSync(path.join(projectRoot, '404.html'), 'utf-8');
  fs.writeFileSync(
    path.join(outputDir, '404.html'),
    notFoundHtml.replaceAll('__SITE_ORIGIN__', siteOrigin),
    'utf-8',
  );
  console.info(`Sitemap, robots и 404.html созданы в dist/ для ${siteOrigin}`);
}

generateSitemap();
