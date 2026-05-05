import { defineConfig, passthroughImageService } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';

import links from './src/markdown/links.ts';
import youtube from './src/markdown/youtube.ts';

const user = (await import('./src/starlight.config.mjs')).default;

export default defineConfig({
	site: user.site,
	markdown: {
		remarkPlugins: [youtube, ...(user.markdown?.remarkPlugins ?? [])],
		rehypePlugins: [links(user.linksHostname), ...(user.markdown?.rehypePlugins ?? [])],
	},
	image: {
		service: passthroughImageService(),
	},
	integrations: [starlight(user.starlight)],
	vite: {
		plugins: [tailwindcss()],
	},
});
