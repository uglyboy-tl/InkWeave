import { memo, useEffect, useRef } from 'react';
import type { ChoiceComponentProps } from '@inkweave/react';

const AutoChoice: React.FC<ChoiceComponentProps> = ({
	val,
	onClick,
	className = '',
	children,
}) => {
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const cd = parseFloat(val || '0');

	useEffect(() => {
		if (cd <= 0) return;

		intervalRef.current = setInterval(() => {
			onClick();
		}, cd * 1000);

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [cd, onClick]);

	return (
		<a className={`inkweave-btn ${className}`} style={{ display: 'none' }}>
			{children}
		</a>
	);
};

export default memo(AutoChoice);