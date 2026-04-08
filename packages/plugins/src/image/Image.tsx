import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useStoryImage } from "./index";
import styles from "./styles.module.css";

interface ImageProps {
  className?: string;
  fallback?: React.ReactNode;
}

const ImageComponent: React.FC<ImageProps> = ({ className = "", fallback = null }) => {
  const image = useStoryImage((state) => state.image);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, []);

  const imageRef = useRef(image);
  imageRef.current = image;

  const handleError = useCallback(() => {
    setHasError(true);
    console.warn(`InkWeave: Failed to load image: ${imageRef.current}`);
  }, []);

  const handleLoad = useCallback(() => {
    setHasError(false);
  }, []);

  const containerClassName = `${styles.container} ${className}`.trim();

  if (hasError) {
    return fallback ? <div className={containerClassName}>{fallback}</div> : null;
  }

  return (
    <div className={containerClassName}>
      <img src={image || undefined} alt="" onError={handleError} onLoad={handleLoad} />
    </div>
  );
};

export default memo(ImageComponent);
