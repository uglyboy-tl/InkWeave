import { memo, useState } from 'react';
import type { ChoiceComponentProps } from '@inkweave/react';

const CooldownChoice: React.FC<ChoiceComponentProps> = ({
	val,
	onClick,
	className = '',
	children,
}) => {
	const [isDisabled, setIsDisabled] = useState(false);
	const cd = parseFloat(val || '0');

	const handleClick = () => {
		if (isDisabled) return;

		onClick();
		setIsDisabled(true);

		setTimeout(() => {
			setIsDisabled(false);
		}, cd * 1000);
	};

	return (
		<a
			className={`inkweave-btn ${className} ${isDisabled ? 'disabled' : ''}`}
			onClick={handleClick}
		>
			{children}
		</a>
	);
};

export default memo(CooldownChoice);