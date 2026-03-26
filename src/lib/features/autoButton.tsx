import { memo, useEffect, useRef } from 'react';
import { ChoiceParser } from '../core/ChoiceParser';
import type { ChoiceProps } from '../core/ChoiceParser';

const AutoChoice: React.FC<ChoiceProps> = ({
	val,
	onClick,
	className = '',
	children,
}) => {
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const cd = parseFloat(val || '0');

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	const handleClick = () => {
		onClick();
		timeoutRef.current = setTimeout(() => {
			handleClick();
		}, cd * 1000);
	};

	useEffect(() => {
		timeoutRef.current = setTimeout(() => {
			handleClick();
		}, cd * 1000);
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	return (
		<a className={`btn ${className}`} style={{ display: 'none' }}>
			{children}
		</a>
	);
};

const load = () => {
	ChoiceParser.add(
		'auto',
		(new_choice, val) => {
			new_choice.type = 'auto';
			new_choice.val = val;
		},
		memo(AutoChoice)
	);
};

export default load;