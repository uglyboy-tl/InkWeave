import { memo, useEffect, useRef } from 'react';
import type { InkStory } from '../core';
import { memory, useStoryImage } from '../features';
import InkImage from './InkImage';
import InkContents from './InkContents';
import InkChoices from './InkChoices';

const SESSION_RESTORE_FLAG = 'ink-player-restore-session';

interface InkStoryComponentProps {
	ink: InkStory;
	className?: string;
}

const InkStoryComponent: React.FC<InkStoryComponentProps> = ({
	ink,
	className = '',
}) => {
	const lastInkTitle = useRef<string | null>(null);
	const image_src = useStoryImage((state: { image: string }) => state.image);

	useEffect(() => {
		if (lastInkTitle.current === ink.title) return;
		lastInkTitle.current = ink.title;

		const sessionData = localStorage.getItem(SESSION_RESTORE_FLAG)
			? localStorage.getItem(`ink-session-${ink.title}`)
			: null;

		if (sessionData) {
			ink.story.ResetState();
			ink.clear();
			memory.load(sessionData, ink);
			localStorage.removeItem(SESSION_RESTORE_FLAG);
		} else {
			ink.restart();
		}
	}, [ink]);

	return (
		<div id="ink-story" className={className}>
			<InkImage image_src={image_src} />
			<InkContents DELAY={ink.options.linedelay ?? 0.05} />
			<InkChoices handleClick={(index) => ink.choose(index)} />
		</div>
	);
};

export default memo(InkStoryComponent);