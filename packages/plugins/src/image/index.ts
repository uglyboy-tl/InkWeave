import { create } from 'zustand';
import { Tags, Patches, type InkStory, type FileHandler } from '@inkweave/core';

declare module '@inkweave/core' {
	interface InkStory {
		image: string;
	}
}

type StoryImage = {
	image: string;
	setImage: (image: string) => void;
};

export const useStoryImage = create<StoryImage>((set) => ({
	image: '',
	setImage: (image) => set({ image }),
}));

const getPath = (path: string, fileHandler?: FileHandler) => {
	if (fileHandler && 'resolveFilename' in fileHandler) {
		return (fileHandler as { resolveFilename: (f: string) => string }).resolveFilename(path);
	}
	return path;
};

const load = () => {
	Tags.add('image', (val: string | null | undefined, ink: InkStory) => {
		if (val) {
			useStoryImage.getState().setImage(getPath(val, ink.options.fileHandler));
		} else {
			useStoryImage.getState().setImage('');
		}
	});

	Patches.add(function () {
		Object.defineProperty(this, 'image', {
			get() {
				return useStoryImage.getState().image;
			},

			set(path: string) {
				useStoryImage.getState().setImage(path);
			},
		});
		this.save_label.push('image');
		this.clears.push(() => {
			this.image = '';
		});
	}, {});
};

export default load;
export { default as Image } from './Image';