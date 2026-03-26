import type { IFileHandler } from "inkjs/compiler/IFileHandler";
import { create } from 'zustand';
import { Tags } from '../core/Tags';
import { Patches } from '../core/Patches';
import { InkStory } from "../core";
import createSelectors from '../stores/createSelectors';

declare module '../core/InkStory' {
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

const getPath = (path: string, fileHandler?: IFileHandler) => {
	if (fileHandler) {
		return fileHandler.ResolveInkFilename(path);
	}
	return path;
};

export const load = () => {
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
		this.save_label.push("image");
		this.clears.push(() => {
			this.image = "";
		});
	}, {});
};

export default load;