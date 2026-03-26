import { memo } from 'react';

interface InkImageProps {
	image_src?: string;
}

const InkImageComponent: React.FC<InkImageProps> = ({ image_src }) => {
	return (
		<div id="ink-image">
			{image_src && <img src={image_src} alt="" />}
		</div>
	);
};

export default memo(InkImageComponent);