# Search visibility

`pnpm build` generates readable HTML for the home page and every project in `src/lib/data.ts`. The React gallery takes over when JavaScript loads. The same project data supplies page titles, summaries, canonical URLs, social previews, and Schema.org data. Vercel serves the generated pages at extensionless URLs and returns a real 404 for unknown paths.

The public discovery files are [/sitemap.xml](https://razielrenz.vercel.app/sitemap.xml) and [/robots.txt](https://razielrenz.vercel.app/robots.txt). Search crawlers can access the same pages as visitors. The portfolio uses clear project descriptions, role and technology details, and documented limitations so search engines and AI systems can summarize the work accurately. There is no separate crawler-only page or guaranteed ranking benefit.

After deployment, submit the sitemap to a verified Google Search Console property and inspect the home page and representative project URLs. Track indexing and impressions over time. When adding projects, use a unique slug, an accurate description, and a real preview image. Keep the canonical origin in `src/lib/seo.ts` current if the public domain changes.
