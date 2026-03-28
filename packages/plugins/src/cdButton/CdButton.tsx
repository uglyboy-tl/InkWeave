import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useStory } from '@inkweave/react';
import { choiceStyles } from '@inkweave/react';
import type { ChoiceComponentProps } from '@inkweave/react';
import { getCooldownKey, getRemainingSeconds, setCooldown, isCooldownActive } from './cooldownState';

const CooldownChoice: React.FC<ChoiceComponentProps> = ({
	choice,
	onClick,
	className = '',
	children,
}) => {
	const cd = parseFloat(choice.val || '0');
	const key = getCooldownKey(choice);
	const ink = useStory();
	const [, setTick] = useState(0);
	const isMountedRef = useRef(true);

	const isDisabled = isCooldownActive(key);
	const remainingSeconds = getRemainingSeconds(key);

	useEffect(() => {
		return () => {
			isMountedRef.current = false;
		};
	}, []);

	useEffect(() => {
		if (!isDisabled) return;
		const interval = setInterval(() => {
			if (isMountedRef.current) {
				setTick(t => t + 1);
			}
		}, 1000);
		return () => clearInterval(interval);
	}, [isDisabled]);

	const handleClick = useCallback(() => {
		if (isDisabled) return;
		onClick();
		setCooldown(key, cd);
		setTick(t => t + 1); // 触发重渲染
	}, [isDisabled, cd, onClick, key]);

	const buttonClass = `${choiceStyles?.button || ''} ${className} ${isDisabled ? choiceStyles?.disabled || '' : ''}`.trim();

	const template = (ink.options.cdTemplate as string) || '{text} ({time})';
	const displayText = isDisabled && remainingSeconds > 0
		? template.replace('{text}', String(children)).replace('{time}', String(remainingSeconds))
		: children;

	return (
		<a className={buttonClass} onClick={handleClick}>
			{displayText}
		</a>
	);
};

export default memo(CooldownChoice);
