import { memo } from 'react';
import { useStory } from '@lib';
import InkStoryComponent from '@lib/components/InkStory';
import InkMenu from './InkMenu';

const InkApp: React.FC = () => {
	const ink = useStory.use.ink();
	if (!ink) return null;

	return (
		<div id="ink" className="ink-container">
			<InkMenu />
			<InkStoryComponent ink={ink} className="ink-content" />
		</div>
	);
};

export default memo(InkApp);