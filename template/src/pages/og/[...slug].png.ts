import type { APIRoute } from 'astro';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { getCollection } from 'astro:content';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import { OgImage } from '../../og/renderer.tsx';
import { ogEnabled, ogConfig } from '../../og/config.ts';

function loadFont(filename: string): Buffer {
	const file = path.join(process.cwd(), 'node_modules/@fontsource/inter/files', filename);
	if (!fs.existsSync(file)) {
		throw new Error(`[og] cannot find font file ${filename}; is @fontsource/inter installed?`);
	}
	return fs.readFileSync(file);
}

// Latin + Latin Extended (covers Czech, Polish, …) so non-ASCII titles render correctly.
const fontRegular = ogEnabled ? loadFont('inter-latin-400-normal.woff') : null;
const fontRegularExt = ogEnabled ? loadFont('inter-latin-ext-400-normal.woff') : null;
const fontBold = ogEnabled ? loadFont('inter-latin-700-normal.woff') : null;
const fontBoldExt = ogEnabled ? loadFont('inter-latin-ext-700-normal.woff') : null;

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

	if (!fontRegular || !fontBold || !fontRegularExt || !fontBoldExt) {
		return new Response('OG generation disabled', { status: 404 });
	}

	const svg = await satori(OgImage({ title, description, config: ogConfig }), {
		width: 1200,
		height: 630,
		fonts: [
			{ name: 'Inter', data: fontRegular, weight: 400, style: 'normal' },
			{ name: 'Inter', data: fontRegularExt, weight: 400, style: 'normal' },
			{ name: 'Inter', data: fontBold, weight: 700, style: 'normal' },
			{ name: 'Inter', data: fontBoldExt, weight: 700, style: 'normal' },
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
