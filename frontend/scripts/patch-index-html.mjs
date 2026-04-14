/**
 * Root-absolute URLs for initial CSS/JS in index.html.
 *
 * Angular recommends <base href="/"> for asset resolution (see
 * https://angular.dev/tools/cli/deployment ). Some clients still resolve
 * relative <link href> against the document URL on deep links (e.g. /login),
 * which requests /login/styles-*.css and breaks styling. This post-step matches a predictable production hosting layout (same host, assets at /).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

const candidates = [
  path.join(rootDir, 'dist', 'frontend', 'browser', 'index.html'),
  path.join(rootDir, 'dist', 'frontend', 'index.html'),
];

const indexPath = candidates.find((p) => fs.existsSync(p));
if (!indexPath) {
  console.error('patch-index-html: no index.html under dist/ (run ng build first)');
  process.exit(1);
}

let html = fs.readFileSync(indexPath, 'utf8');
const before = html;

html = html
  .replace(/href="(styles-[^"]+\.css)"/g, 'href="/$1"')
  .replace(/href="(chunk-[^"]+\.js)"/g, 'href="/$1"')
  .replace(/src="(main-[^"]+\.js)"/g, 'src="/$1"')
  .replace(/href="favicon\.ico"/g, 'href="/favicon.ico"');

if (html === before) {
  console.warn('patch-index-html: no substitutions applied');
}

fs.writeFileSync(indexPath, html);
console.log('patch-index-html: ok →', path.relative(rootDir, indexPath));
