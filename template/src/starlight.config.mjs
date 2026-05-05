// Default Starlight config — committed so `npm run dev` works inside template/.
// Callers override this by providing their own starlight.config.mjs at the
// caller-repo root; the action copies it over this file at build time.
//
// STARLIGHT_DEFAULT_TITLE is set by the action to GITHUB_REPOSITORY's repo name
// when caller has no config; falls back to 'Site' for local dev.
export default {
	starlight: {
		title: process.env.STARLIGHT_DEFAULT_TITLE || 'Site',
	},
	// Open Graph image generation (Satori + Resvg).
	// Set `og: false` to disable, or pass a config object:
	//   og: {
	//     brand: 'My Site',
	//     domain: 'example.com',
	//     tagline: 'Optional uppercase line under brand',
	//     accent: ['#4f46e5', '#312e81'],
	//     logo: './public/logo.svg',  // optional, embedded as data URI
	//   }
	// Per-page override: set `ogImage:` (absolute URL or site-relative path) in frontmatter.
	og: {
		brand: process.env.STARLIGHT_DEFAULT_TITLE || 'Site',
	},
};
