import { defineConfig, passthroughImageService } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';

import links from './src/markdown/links.ts';
import youtube from './src/markdown/youtube.ts';

const user = (await import('./src/starlight.config.mjs')).default;

const ogEnabled = user.og !== false && (user.og === undefined || user.og.enabled !== false);

const starlightConfig = { ...(user.starlight ?? {}) };
if (ogEnabled) {
	starlightConfig.components = {
		Head: './src/components/Head.astro',
		...(starlightConfig.components ?? {}),
	};
}

export default defineConfig({
	site: process.env.STARLIGHT_SITE || user.site,
	base: process.env.STARLIGHT_BASE || user.base,
	markdown: {
		remarkPlugins: [youtube, ...(user.markdown?.remarkPlugins ?? [])],
		rehypePlugins: [links(user.linksHostname), ...(user.markdown?.rehypePlugins ?? [])],
	},
	image: {
		service: passthroughImageService(),
	},
	integrations: [starlight(starlightConfig)],
	vite: {
		plugins: [tailwindcss()],
	},
});
