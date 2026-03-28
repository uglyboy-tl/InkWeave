import { memo, useState, useCallback, useRef, useEffect } from 'react';
import type { ChoiceComponentProps } from '@inkweave/react';
import { choiceStyles } from '@inkweave/react';

const CooldownChoice: React.FC<ChoiceComponentProps> = ({
	val,
	onClick,
	className = '',
	children,
}) => {
	const [isDisabled, setIsDisabled] = useState(false);
	const cd = parseFloat(val || '0');
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const onClickRef = useRef(onClick);

	onClickRef.current = onClick;

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	const handleClick = useCallback(() => {
		if (isDisabled) return;

		onClickRef.current();
		setIsDisabled(true);

		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = setTimeout(() => {
			setIsDisabled(false);
		}, cd * 1000);
	}, [isDisabled, cd]);

	const buttonClass = `${choiceStyles?.button || ''} ${className} ${isDisabled ? choiceStyles?.disabled || '' : ''}`.trim();

	return (
		<a
			className={buttonClass}
			onClick={handleClick}
		>
			{children}
		</a>
	);
};

export default memo(CooldownChoice);
