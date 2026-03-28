import { memo, createElement, useCallback } from 'react';
import { Choice, choicesStore } from '@inkweave/core';
import { useStory } from './Story';
import { ChoiceComponents } from './ChoiceComponents';

interface ChoiceItemProps {
	choice: Choice;
	index: number;
	onClick: (index: number) => void;
	className: string;
}

const ChoiceItem: React.FC<ChoiceItemProps> = memo(
  ({ choice, index, onClick, className }) => {
    const handleClick = useCallback(() => {
      if (choice.type !== 'unclickable') {
        onClick(choice.index);
      }
    }, [choice.index, choice.type, onClick]);

    const Component = ChoiceComponents.get(choice.type);
    if (Component) {
      return (
        <li style={{ '--index': index } as React.CSSProperties}>
          {createElement(Component, {
            onClick: handleClick,
            className,
            val: choice.val,
            children: choice.text,
          })}
        </li>
      );
    }

    return (
      <li style={{ '--index': index } as React.CSSProperties}>
        <a
          onClick={handleClick}
          className={`${className} ${choice.type === 'unclickable' ? 'disabled' : ''}`}
          aria-disabled={choice.type === 'unclickable'}
        >
          {choice.text}
        </a>
      </li>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.choice.index === nextProps.choice.index &&
      prevProps.choice.type === nextProps.choice.type &&
      prevProps.choice.text === nextProps.choice.text &&
      prevProps.choice.val === nextProps.choice.val &&
      prevProps.className === nextProps.className
    );
  }
);
ChoiceItem.displayName = 'ChoiceItem';

interface ChoicesProps {
	onClick?: (index: number) => void;
	className?: string;
}

const ChoicesComponent: React.FC<ChoicesProps> = ({
	onClick,
	className = 'inkweave-btn',
}) => {
	const ink = useStory();
	const choices = choicesStore((state) => state.choices);
	const inkRecord = ink as unknown as Record<string, unknown>;
	const canShow =
		inkRecord && 'choicesCanShow' in inkRecord
			? (inkRecord.choicesCanShow as boolean)
			: true;

	const handleClick = useCallback((index: number) => {
		onClick?.(index);
		ink.choose(index);
	}, [ink, onClick]);

	return (
		<ul
			id="inkweave-choices"
			key={canShow ? 'visible' : 'hidden'}
			style={{ visibility: canShow ? 'visible' : 'hidden' }}
		>
			{choices.map((choice: Choice, index: number) => (
				<ChoiceItem
					key={choice.index}
					choice={choice}
					index={index}
					onClick={handleClick}
					className={className}
				/>
			))}
		</ul>
	);
};

export default memo(ChoicesComponent);