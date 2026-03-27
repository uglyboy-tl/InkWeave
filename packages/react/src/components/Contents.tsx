import { memo, CSSProperties } from 'react';
import { CHOICE_SEPARATOR, contentsStore } from '@inkweave/core';
import { useStory } from './Story';

interface ContentsProps {
	lineDelay?: number;
	className?: string;
}

const ContentsComponent: React.FC<ContentsProps> = ({
	lineDelay = 0.05,
	className = '',
}) => {
	const ink = useStory();
	const contents = contentsStore((state) => state.contents);
	const inkRecord = ink as unknown as Record<string, unknown>;
	const visibleLines =
		inkRecord?.visibleLines != undefined
			? (inkRecord.visibleLines as number)
			: contents.length;

	return (
		<section id="inkweave-contents">
			{contents.map((item: string, i: number) => {
				const style: CSSProperties = {
					'--delay': `${
						(i > visibleLines ? i - visibleLines : 0) * lineDelay
					}s`,
				} as CSSProperties & { '--delay': string };

				const isDivider = item === CHOICE_SEPARATOR;
				const key = isDivider ? `divider_${i}` : `line_${i}_${item.slice(0, 20)}`;

				if (isDivider) {
					return (
						<div key={key} style={style}>
							<hr className="inkweave-divider" />
						</div>
					);
				}

				return (
					<div key={key} style={style}>
						<p className={className}>{item}</p>
					</div>
				);
			})}
		</section>
	);
};

export default memo(ContentsComponent);