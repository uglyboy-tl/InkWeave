import { Tags } from '../core/Tags';

const ALLOWED_PROTOCOLS = ['http:', 'https:'];

const load = () => {
	Tags.add('linkopen', (val: string | null | undefined) => {
		if (val) {
			try {
				const url = new URL(val);
				if (!ALLOWED_PROTOCOLS.includes(url.protocol)) {
					console.warn('InkPlayer: Blocked unsafe URL protocol:', url.protocol);
					return;
				}
			} catch {
				console.warn('InkPlayer: Invalid URL:', val);
				return;
			}
			window.open(val, '_blank', 'noopener,noreferrer');
		}
	});
};

export default load;