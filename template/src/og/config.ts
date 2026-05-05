import type { OgConfig } from './renderer.tsx';
import * as fs from 'node:fs';
import * as path from 'node:path';

interface UserOg extends OgConfig {
	enabled?: boolean;
	logo?: string;
}

interface UserConfig {
	og?: UserOg | false;
}

const userConfig = (await import('../starlight.config.mjs' as string)).default as UserConfig;

const raw: UserOg | false | undefined = userConfig.og;

export const ogEnabled =
	raw !== false && (raw === undefined || raw.enabled !== false);

function resolveLogo(logoPath: string | undefined): string | undefined {
	if (!logoPath) return undefined;
	const abs = path.isAbsolute(logoPath) ? logoPath : path.join(process.cwd(), logoPath);
	if (!fs.existsSync(abs)) {
		console.warn(`[og] logo not found at ${abs}`);
		return undefined;
	}
	const ext = path.extname(abs).toLowerCase();
	const data = fs.readFileSync(abs);
	if (ext === '.svg') {
		return `data:image/svg+xml;base64,${data.toString('base64')}`;
	}
	if (ext === '.png') return `data:image/png;base64,${data.toString('base64')}`;
	if (ext === '.jpg' || ext === '.jpeg') return `data:image/jpeg;base64,${data.toString('base64')}`;
	console.warn(`[og] unsupported logo extension ${ext}; expected .svg/.png/.jpg`);
	return undefined;
}

const og: UserOg = raw ? raw : ({} as UserOg);

export const ogConfig: OgConfig = {
	brand: og.brand,
	domain: og.domain,
	tagline: og.tagline,
	accent: og.accent,
	textColor: og.textColor,
	mutedColor: og.mutedColor,
	bgGradient: og.bgGradient,
	logoSrc: resolveLogo(og.logo),
};
