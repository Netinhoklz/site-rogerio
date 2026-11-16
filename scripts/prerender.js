// Roda depois do `vite build` (ver "build" no package.json). Deixa a pasta dist/ pronta para publicar
// (Render, Locaweb ou qualquer hospedagem de arquivos estáticos):
// - coloca o HTML da página dentro do index.html (o Google lê o conteúdo sem precisar executar JavaScript);
// - adiciona os dados da empresa no formato do Google (schema.org AccountingService);
// - gera robots.txt e, se o endereço do site for conhecido, canonical e sitemap.xml.
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as c from '../src/data/content.js';

const ssrDir = fileURLToPath(new URL('../dist-ssr/', import.meta.url));
const { render } = await import(new URL('../dist-ssr/entry-server.js', import.meta.url));
const dist = (name) => fileURLToPath(new URL(`../dist/${name}`, import.meta.url));

// Endereço público do site, nesta ordem: variável de ambiente SITE_URL (definida no painel da hospedagem),
// SITE_URL do content.js, e por último o endereço que o Render dá ao site (https://nome.onrender.com).
const site = (process.env.SITE_URL || c.SITE_URL || process.env.RENDER_EXTERNAL_URL || '').replace(/\/+$/, '');

const business = {
    '@context': 'https://schema.org',
    '@type': 'AccountingService',
    name: 'GRB Assessoria Contábil',
    ...(site && { url: `${site}/`, logo: `${site}/logo-grb-quadrado.png`, image: `${site}/logo-grb-quadrado.png` }),
    telephone: c.PHONE_TEL,
    address: {
        '@type': 'PostalAddress',
        streetAddress: `${c.ADDRESS_STREET} - ${c.ADDRESS_DISTRICT}`,
        addressLocality: c.ADDRESS_CITY,
        addressRegion: c.ADDRESS_STATE,
        postalCode: c.ADDRESS_CEP,
        addressCountry: 'BR',
    },
    areaServed: { '@type': 'City', name: c.ADDRESS_CITY },
    openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: c.OPENING_HOURS.days,
        opens: c.OPENING_HOURS.opens,
        closes: c.OPENING_HOURS.closes,
    },
    sameAs: [c.INSTAGRAM_URL],
};

let head = `<script type="application/ld+json">${JSON.stringify(business).replace(/</g, '\\u003c')}</script>`;
if (site) {
    head += `\n    <link rel="canonical" href="${site}/">\n    <meta property="og:url" content="${site}/">`;
    head += `\n    <meta property="og:image" content="${site}/logo-grb-quadrado.png">`;
}

const ROOT = '<div id="root"></div>';
let html = readFileSync(dist('index.html'), 'utf8');
if (!html.includes(ROOT) || !html.includes('</head>')) {
    throw new Error('dist/index.html não tem <div id="root"></div> ou </head>: o pré-render não pode continuar.');
}
html = html
    .replace('</head>', `    ${head}\n</head>`)
    .replace(ROOT, `<div id="root">${render()}</div>`);
writeFileSync(dist('index.html'), html);

writeFileSync(dist('robots.txt'), `User-agent: *\nAllow: /\n${site ? `\nSitemap: ${site}/sitemap.xml\n` : ''}`);
if (site) {
    writeFileSync(dist('sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${site}/</loc></url>\n</urlset>\n`);
} else {
    console.warn('\n⚠  Endereço do site não definido: canonical e sitemap.xml NÃO foram gerados.\n   Defina SITE_URL (variável de ambiente ou src/data/content.js), ex.: https://www.seudominio.com.br, e gere o build de novo.\n');
}

rmSync(ssrDir, { recursive: true, force: true });
console.log(`✓ dist/ pronto para publicar${site ? ` (endereço do site: ${site})` : ''}.`);
