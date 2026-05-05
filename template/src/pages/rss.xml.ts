import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import userConfig from '../starlight.config.mjs';

type UserRss = { title?: string; description?: string; customData?: string };
type UserConfig = { rss?: UserRss; starlight?: { title?: string } };
const user = userConfig as UserConfig;

/** Match Starlight's `slugToPathname` so feed links match deployed URLs. */
function docSlugToPathname(slug: string): string {
	const param =
		slug === 'index' || slug === '' || slug === '/'
			? undefined
			: (slug.endsWith('/index') ? slug.slice(0, -6) : slug).normalize();
	return param ? `/${param}/` : '/';
}

export async function GET(context: APIContext) {
	if (!context.site) {
		return new Response('RSS disabled: no `site` URL configured in starlight.config.mjs', { status: 404 });
	}
	const docs = await getCollection('docs');
	const base = context.site;

	const items = docs
		.filter((entry) => !entry.data.draft)
		.map((entry) => {
			const link = new URL(docSlugToPathname(entry.id), base).href;
			const pubDate =
				entry.data.lastUpdated instanceof Date ? entry.data.lastUpdated : undefined;
			return {
				link,
				title: entry.data.title,
				description: entry.data.description,
				pubDate,
			};
		})
		.sort((a, b) => (b.pubDate?.getTime() ?? 0) - (a.pubDate?.getTime() ?? 0));

	const rssConfig = user.rss ?? {};
	return rss({
		title: rssConfig.title ?? user.starlight?.title ?? 'Site feed',
		description: rssConfig.description ?? '',
		site: base,
		items,
		customData: rssConfig.customData ?? '<language>en</language>',
	});
}
