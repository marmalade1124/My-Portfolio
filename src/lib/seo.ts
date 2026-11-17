import { PERSONAL, type Project } from './data.ts';

export const SITE = 'https://razielrenz.vercel.app';
export const projectPath = (project: Project) => `/work/${project.id}`;
export const bio = 'Raziel Renz Salamat is a computer engineering student and developer in Tagum City, Philippines. He builds web apps, Windows tools, and CAD prototypes. Expected graduation: 2027.';

export function pageSeo(project?: Project, missing = false) {
  const url = SITE + (project ? projectPath(project) : '/');
  const title = missing ? 'Project not found | Raziel Salamat' : project
    ? `${project.title} | Raziel Salamat`
    : 'Raziel Salamat | Developer & CAD Designer';
  const description = missing ? 'Browse the portfolio for available projects.' : project
    ? project.description.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? project.description
    : bio;
  const image = SITE + (project?.coverImage ?? project?.images?.[0] ?? '/portrait.png');
  const shareImage = project ? image : SITE + '/portfolio-share.jpg';
  const shareImageAlt = project ? `${project.title} project preview` : 'RR logo beside Raziel Salamat’s name and portrait';
  const person = {
    '@type': 'Person', '@id': `${SITE}/#raziel`, name: PERSONAL.name,
    alternateName: 'Raziel Salamat', url: SITE + '/',
    sameAs: Object.values(PERSONAL.socials),
    jobTitle: PERSONAL.title,
  };
  const schema = {
    '@context': 'https://schema.org',
    '@type': project ? 'ItemPage' : 'ProfilePage', url, name: title, description,
    mainEntity: project ? {
      '@type': 'CreativeWork', name: project.title, url,
      description: project.description, genre: project.category,
      creator: person, image, keywords: project.techStack,
    } : { ...person, description: bio, image },
  };
  return { title, canonical: missing ? '' : url, schema: missing ? '' : JSON.stringify(schema).replace(/</g, '\\u003c'),
    tags: {
      description, robots: missing ? 'noindex' : 'index, follow, max-image-preview:large',
      'og:type': project ? 'article' : 'profile', 'og:site_name': 'Raziel Salamat',
      'og:title': title, 'og:description': description, 'og:url': missing ? '' : url,
      'og:image': shareImage, 'og:image:alt': shareImageAlt,
      ...(!project && { 'og:image:width': '1200', 'og:image:height': '630' }),
      'twitter:card': 'summary_large_image', 'twitter:image': shareImage, 'twitter:image:alt': shareImageAlt,
    },
  };
}
