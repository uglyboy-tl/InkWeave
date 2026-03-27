import { memo, useEffect, useRef, createContext, useContext } from 'react';
import type { InkStory } from '@inkweave/core';

const StoryContext = createContext<InkStory | null>(null);

export const useStory = () => {
	const ink = useContext(StoryContext);
	if (!ink) {
		throw new Error('useStory must be used within StoryProvider');
	}
	return ink;
};

interface StoryProviderProps {
	ink: InkStory;
	children: React.ReactNode;
}

export const StoryProvider: React.FC<StoryProviderProps> = ({
	ink,
	children,
}) => {
	return (
		<StoryContext.Provider value={ink}>
			{children}
		</StoryContext.Provider>
	);
};

interface StoryProps {
	ink: InkStory;
	children?: React.ReactNode;
	className?: string;
	onInit?: (ink: InkStory) => void;
}

const StoryComponent: React.FC<StoryProps> = ({
	ink,
	children,
	className = '',
	onInit,
}) => {
	const onInitRef = useRef(onInit);
	onInitRef.current = onInit;

	useEffect(() => {
		ink.restart();
		onInitRef.current?.(ink);
	}, [ink]);

	return (
		<StoryProvider ink={ink}>
			<div id="inkweave-story" className={className}>
				{children}
			</div>
		</StoryProvider>
	);
};

export default memo(StoryComponent);