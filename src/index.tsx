import { createRoot } from 'react-dom/client';
import { Compiler } from 'inkjs/compiler/Compiler';
import { CompilerOptions } from 'inkjs/compiler/CompilerOptions';
import InkApp from './components/InkApp';
import { useStory, loadImage, loadAudio, loadFadeEffect, loadMemory } from '@lib';
import type { InkPlayerOptions } from '@lib';
import { FetchFileHandler } from './utils/FetchFileHandler';
import './styles/index.css';

class InkPlayerClass {
	static version = '1.0.0';

	static init(options: InkPlayerOptions) {
		const containerEl =
			typeof options.container === 'string'
				? document.querySelector(options.container)
				: options.container;

		if (!containerEl) {
			console.error('InkPlayer: Container not found');
			return;
		}

		loadImage();
		loadAudio();
		loadFadeEffect();
		loadMemory();

		try {
			const fileHandler = new FetchFileHandler({
				basePath: options.basePath,
			});

			const compiler = new Compiler(
				options.story,
				new CompilerOptions(null, [], false, null, fileHandler)
			);

			const story = compiler.Compile();
			const title = options.title || 'Ink Story';

			window.__INK_PLAYER_OPTIONS__ = options;

			useStory.getState().setStory(story, title, { fileHandler });

			containerEl.innerHTML = '';
			const root = createRoot(containerEl);

			if (options.theme === 'dark') {
				containerEl.classList.add('ink-dark');
			}

			root.render(<InkApp />);

			console.log(`InkPlayer v${this.version} initialized`);
		} catch (error) {
			console.error('InkPlayer: Failed to initialize', error);
		}
	}
}

if (typeof window !== 'undefined') {
	(window as any).InkPlayer = InkPlayerClass;
}

export { InkPlayerClass as InkPlayer };
export { FetchFileHandler };