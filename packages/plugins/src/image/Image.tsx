import { memo, useState, useCallback, useEffect, useRef } from 'react';
import { useStoryImage } from './index';

interface ImageProps {
	className?: string;
	fallback?: React.ReactNode;
}

const ImageComponent: React.FC<ImageProps> = ({ className = '', fallback = null }) => {
	const image = useStoryImage((state) => state.image);
	const [hasError, setHasError] = useState(false);

	useEffect(() => {
		setHasError(false);
	}, [image]);

	const imageRef = useRef(image);
	imageRef.current = image;

	const handleError = useCallback(() => {
		setHasError(true);
		console.warn(`InkWeave: Failed to load image: ${imageRef.current}`);
	}, []);

	const handleLoad = useCallback(() => {
		setHasError(false);
	}, []);

	const containerClassName = className || '';

	if (!image) return null;

	if (hasError) {
		return fallback ? (
			<div id="inkweave-image" className={containerClassName}>
				{fallback}
			</div>
		) : null;
	}

	return (
		<div id="inkweave-image" className={containerClassName}>
			<img src={image} alt="" onError={handleError} onLoad={handleLoad} />
		</div>
	);
};

export default memo(ImageComponent);