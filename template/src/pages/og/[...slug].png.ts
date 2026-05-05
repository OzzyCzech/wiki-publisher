import type { APIRoute } from 'astro';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { getCollection } from 'astro:content';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import { OgImage } from '../../og/renderer.tsx';
import { ogEnabled, ogConfig } from '../../og/config.ts';

// Bundled Inter ttfs cover the full Inter glyph set (basic Latin + latin-ext +
// the extras Czech/Polish/Vietnamese/… need). Satori does NOT do glyph fallback
// across multiple fonts of the same name+weight+style, so a single combined
// font file is required — @fontsource/inter ships only narrow subsets and is
// unsuitable here.
const fontDir = path.join(process.cwd(), 'src/og/fonts');
const fontRegular = ogEnabled ? fs.readFileSync(path.join(fontDir, 'Inter-Regular.ttf')) : null;
const fontBold = ogEnabled ? fs.readFileSync(path.join(fontDir, 'Inter-Bold.ttf')) : null;

export async function getStaticPaths() {
	if (!ogEnabled) return [];
	const docs = await getCollection('docs');
	return docs
		.filter((entry) => !(entry.data as { ogImage?: string }).ogImage)
		.map((entry) => {
			const slug = entry.id === 'index' ? 'index' : entry.id;
			return {
				params: { slug },
				props: {
					title: entry.data.title,
					description: entry.data.description,
				},
			};
		});
}

export const GET: APIRoute = async ({ props }) => {
	const { title, description } = props as {
		title: string;
		description?: string;
	};

	if (!fontRegular || !fontBold) {
		return new Response('OG generation disabled', { status: 404 });
	}

	const svg = await satori(OgImage({ title, description, config: ogConfig }), {
		width: 1200,
		height: 630,
		fonts: [
			{ name: 'Inter', data: fontRegular, weight: 400, style: 'normal' },
			{ name: 'Inter', data: fontBold, weight: 700, style: 'normal' },
		],
	});

	const png = new Resvg(svg).render().asPng();

	return new Response(png as Uint8Array<ArrayBuffer>, {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=31536000, immutable',
		},
	});
};
