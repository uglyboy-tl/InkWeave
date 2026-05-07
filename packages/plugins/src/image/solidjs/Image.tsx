import type { JSX } from "solid-js";
import { createEffect, createSignal, onCleanup, Show } from "solid-js";
import { useStoryImage } from "../index";
import styles from "./Image.module.css";

interface ImageProps {
  class?: string;
  fallback?: JSX.Element;
}

const ImageComponent = (props: ImageProps) => {
  const [image, setImage] = createSignal(useStoryImage.getState().image);
  const [hasError, setHasError] = createSignal(false);

  createEffect(() => {
    const unsub = useStoryImage.subscribe((state) => {
      setImage(state.image);
      setHasError(false);
    });
    onCleanup(unsub);
  });

  const handleError = () => {
    setHasError(true);
    console.warn(`InkWeave: Failed to load image: ${image()}`);
  };

  const handleLoad = () => {
    setHasError(false);
  };

  const containerClassName = `${styles.container} ${props.class || ""}`.trim();

  return (
    <Show when={image()}>
      <Show
        when={!hasError()}
        fallback={
          <Show when={props.fallback}>
            <div id="inkweave-image" class={containerClassName}>
              {props.fallback}
            </div>
          </Show>
        }
      >
        <div id="inkweave-image" class={containerClassName}>
          <img src={image() ?? ""} alt="" onError={handleError} onLoad={handleLoad} />
        </div>
      </Show>
    </Show>
  );
};

export default ImageComponent;
