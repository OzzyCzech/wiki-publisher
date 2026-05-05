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
};
