// Default Starlight config — committed so `npm run dev` works inside template/.
// Callers override this by providing their own starlight.config.mjs at the
// caller-repo root; the action copies it over this file at build time.
export default {
	starlight: {
		title: 'Site',
	},
};
