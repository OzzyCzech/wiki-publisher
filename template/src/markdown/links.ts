import rehypeExternalLinks, {type Options} from 'rehype-external-links';
import type {Element} from 'hast';

export default function links(hostname?: string) {
	const options: Options = {
		target: '_blank',
		rel: ['noopener', 'noreferrer'],
		test: (node: Element) => {
			const href = node.properties?.href;
			if (typeof href !== 'string' || !URL.canParse(href)) return false;
			if (!hostname) return true;
			return new URL(href).hostname !== hostname;
		}
	};
	return [rehypeExternalLinks, options] as const;
}
