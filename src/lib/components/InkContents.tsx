import { memo, CSSProperties } from 'react';
import { CHOICE_SEPARATOR, useContents, useStory } from '../stores';

interface InkContentsProps {
	DELAY: number;
	className?: string;
}

const InkContentsComponent: React.FC<InkContentsProps> = ({
	DELAY,
	className = '',
}) => {
	const ink = useStory.getState().ink;
	const contents = useContents.use.contents();
	const inkRecord = ink as unknown as Record<string, unknown> | null;
	const visibleLines =
		inkRecord?.visibleLines != undefined ? inkRecord.visibleLines as number : contents.length;

	return (
		<section id="ink-contents">
			{contents.map((item: string, i: number) => {
				const style: CSSProperties = {
					'--delay': `${
						(i > visibleLines ? i - visibleLines : 0) * DELAY
					}s`,
				} as CSSProperties & { '--delay': string };

				if (item === CHOICE_SEPARATOR) {
					return (
						<div key={`${i}_divider`} style={style}>
							<hr className="ink-divider" />
						</div>
					);
				}

				return (
					<div key={`${i}_${item}`} style={style}>
						<p className={className}>{item}</p>
					</div>
				);
			})}
		</section>
	);
};

export default memo(InkContentsComponent);