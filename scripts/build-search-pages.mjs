import assert from 'node:assert/strict';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { BUSINESS_EXAMPLES, BUSINESS_OFFER, PERSONAL, PROJECTS } from '../src/lib/data.ts';
import { bio, pageSeo, projectPath, SITE } from '../src/lib/seo.ts';
import { WRITING, writingPath } from '../src/lib/editorial-writing.ts';
import { FILIPINO, localizedPath } from '../src/lib/editorial-language.ts';

const escape = value => String(value).replace(/[&<>"']/g, char =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const link = (href, label) => `<a href="${escape(href)}">${escape(label)}</a>`;
const template = readFileSync('dist/index.html', 'utf8');
assert.ok(template.includes('<div id="root"></div>'), 'Expected Vite HTML root');
const ids = new Set();
for (const project of PROJECTS) {
  assert.match(project.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert.ok(!ids.has(project.id), `Duplicate project: ${project.id}`);
  ids.add(project.id);
}

function render(project, missing = false, section) {
  const { title, canonical, schema, tags } = pageSeo(project, missing);
  const pageTitle = section ? `${section.title} | Raziel Salamat` : title;
  assert.ok(existsSync(`dist${new URL(tags['og:image']).pathname}`), `Missing share image: ${title}`);
  const head = [
    `<title>${escape(pageTitle)}</title>`,
    canonical && `<link rel="canonical" href="${section ? SITE + section.path : canonical}">`,
    !missing && ['en', 'fil'].map(lang => `<link rel="alternate" hreflang="${lang}" href="${SITE}${lang === 'fil' ? localizedPath(project ? projectPath(project) : section?.path ?? '/', true) : project ? projectPath(project) : section?.path ?? '/'}">`).join('\n    '),
    ...Object.entries(tags).filter(([, value]) => value).map(([key, value]) =>
      `<meta ${key.startsWith('og:') ? 'property' : 'name'}="${key}" content="${escape(section && key === 'og:title' ? pageTitle : section && key === 'og:url' ? SITE + section.path : value)}">`),
    schema && !section && `<script id="page-schema" type="application/ld+json">${schema}</script>`,
  ].filter(Boolean).join('\n    ');
  const study = project?.caseStudy;
  const content = section ? section.content : missing ? `<h1>Project not found.</h1><p>${link('/', 'Browse the portfolio')}</p>`
    : project ? `<nav>${link('/', 'All projects')}</nav><h1>${escape(project.title)}</h1>
      <p>${escape(project.category)} · ${escape(project.year)}</p>
      <p>${escape(project.description)}</p>
      <h2>My role</h2><p>${escape(project.role)}</p>
      <h2>Technology</h2><p>${escape(project.techStack.join(', '))}</p>
      ${study ? [['Problem', study.problem], ['Approach', study.decision], ['Result', study.result], ['Scope and limitations', study.limitations]].map(([label, copy]) => `<h2>${label}</h2><p>${escape(copy)}</p>`).join('') : ''}
      <p>${[project.liveUrl && link(project.liveUrl, project.liveLabel ?? 'Visit project'), project.githubUrl && link(project.githubUrl, 'Source code'), project.videoUrl && link(project.videoUrl, 'Watch video')].filter(Boolean).join(' · ')}</p>`
    : `<h1>${escape(PERSONAL.name)}</h1><p>${escape(bio)}</p>
      <h2>Websites for service businesses</h2><p>${escape(BUSINESS_OFFER)}</p>
      <ul>${BUSINESS_EXAMPLES.map(example => `<li>${link(example.path, example.title)}. ${escape(example.proof)}</li>`).join('')}</ul>
      <p>${link(`mailto:${PERSONAL.email}?subject=Website%20project`, 'Discuss your website')}</p>
      <p>${link(PERSONAL.socials.github, 'GitHub')} · ${link(PERSONAL.socials.linkedin, 'LinkedIn')}</p>
      <h2>Projects</h2><ul>${PROJECTS.map(item => `<li>${link(projectPath(item), item.title)} — ${escape(item.category)}</li>`).join('')}</ul>`;
  return template.replace(/<meta name="description"[^>]*\/>\s*<title>.*?<\/title>/s, () => head)
    .replace('<div id="root"></div>', () => `<div id="root"><main data-static-fallback style="max-width:46rem;margin:3rem auto;padding:0 1.25rem;line-height:1.6">${content}</main></div>`);
}

mkdirSync('dist/work', { recursive: true });
for (const project of PROJECTS) writeFileSync(`dist${projectPath(project)}.html`, render(project));
writeFileSync('dist/index.html', render());
const sections = [
  { path: '/about', title: 'About', content: `<h1>About</h1><p>${escape(bio)}</p><p>${link('/resume.pdf', 'Résumé')}</p>` },
  { path: '/media', title: 'Film & Media', content: `<h1>Film &amp; Media</h1><ul>${PROJECTS.filter(item => item.tag === 'media').map(item => `<li>${link(projectPath(item), item.title)}</li>`).join('')}</ul>` },
  ...WRITING.map(article => ({ path: writingPath(article.slug), title: article.title, content: `<article><h1>${escape(article.title)}</h1><p>${escape(article.summary)}</p>${article.sections.map(([heading, body]) => `<h2>${escape(heading)}</h2><p>${escape(body)}</p>`).join('')}</article>` })),
];
mkdirSync('dist/writing', { recursive: true });
for (const section of sections) writeFileSync(`dist${section.path}.html`, render(undefined, false, section));
const filipinoSections = [
  { path: '/', title: 'Portfolio', content: `<h1>${escape(PERSONAL.name)}</h1><p>${escape(FILIPINO.intro.join(' '))}</p><h2>Mga proyekto</h2><ul>${PROJECTS.map(item => `<li>${link(localizedPath(projectPath(item), true), item.title)}</li>`).join('')}</ul><h2>Mga sulatin</h2><ul>${WRITING.map((item, i) => `<li>${link(localizedPath(writingPath(item.slug), true), FILIPINO.writing[i][0])}</li>`).join('')}</ul>` },
  { path: '/about', title: FILIPINO.nav[2], content: `<h1>${escape(FILIPINO.about[0])}</h1>${FILIPINO.about.slice(1).map(copy => `<p>${escape(copy)}</p>`).join('')}` },
  { path: '/media', title: FILIPINO.nav[3], content: `<h1>${escape(FILIPINO.nav[3])}</h1><ul>${PROJECTS.filter(item => item.tag === 'media').map(item => `<li>${link(localizedPath(projectPath(item), true), item.title)}</li>`).join('')}</ul>` },
  ...WRITING.map((article, index) => ({ path: writingPath(article.slug), title: FILIPINO.writing[index][0], content: `<article><h1>${escape(FILIPINO.writing[index][0])}</h1><p>${escape(FILIPINO.writing[index][1])}</p>${FILIPINO.articles[index].map(([heading, body]) => `<h2>${escape(heading)}</h2><p>${escape(body)}</p>`).join('')}</article>` })),
];
mkdirSync('dist/fil/work', { recursive: true });
mkdirSync('dist/fil/writing', { recursive: true });
for (const section of filipinoSections) {
  const localized = localizedPath(section.path, true);
  writeFileSync(`dist${localized}.html`, render(undefined, false, section)
    .replace('<html lang="en">', '<html lang="fil">')
    .replace(`rel="canonical" href="${SITE}${section.path}"`, `rel="canonical" href="${SITE}${localized}"`)
    .replace(`property="og:url" content="${SITE}${section.path}"`, `property="og:url" content="${SITE}${localized}"`));
}
for (const project of PROJECTS) {
  const original = projectPath(project);
  const localized = localizedPath(original, true);
  const lead = FILIPINO.projectLeads[project.id];
  writeFileSync(`dist${localized}.html`, render(project).replace('<html lang="en">', '<html lang="fil">')
    .replace('<main data-static-fallback', '<main lang="en" data-static-fallback')
    .replace(`<p>${escape(project.description)}</p>`, () => `${lead ? `<p lang="fil">${escape(lead)}</p>` : ''}<p>${escape(project.description)}</p>`)
    .replace(`rel="canonical" href="${SITE}${original}"`, `rel="canonical" href="${SITE}${lead ? localized : original}"`)
    .replace(`property="og:url" content="${SITE}${original}"`, `property="og:url" content="${SITE}${localized}"`));
}
writeFileSync('dist/404.html', render(undefined, true));
const sitemapPaths = ['/', ...sections.map(section => section.path), ...PROJECTS.map(projectPath), ...filipinoSections.map(section => localizedPath(section.path, true)), ...PROJECTS.filter(project => FILIPINO.projectLeads[project.id]).map(project => localizedPath(projectPath(project), true))];
for (const route of sitemapPaths) assert.ok(existsSync(route === '/' ? 'dist/index.html' : `dist${route}.html`), `Missing page for ${route}`);
writeFileSync('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapPaths.map(route => `  <url><loc>${SITE}${route}</loc></url>`).join('\n')}\n</urlset>\n`);
writeFileSync('dist/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log(`Generated ${sitemapPaths.length} sitemap entries, localized HTML pages, robots.txt and a 404 page.`);
