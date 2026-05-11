import type { Choice } from "@inkweave/core";
import { choicesStore } from "@inkweave/core";

export interface SwipeOptions {
  threshold?: number;
  maxRotation?: number;
  onSwipeLeft?: (choice: Choice) => void;
  onSwipeRight?: (choice: Choice) => void;
  onSwipeCancel?: () => void;
  onMove?: (deltaX: number, threshold: number) => void;
}

interface SwipeState {
  startX: number;
  currentX: number;
  isDragging: boolean;
}

export function createSwipeHandler(element: HTMLElement, options: SwipeOptions): () => void {
  const {
    threshold = 80,
    maxRotation = 15,
    onSwipeLeft,
    onSwipeRight,
    onSwipeCancel,
    onMove,
  } = options;
  const state: SwipeState = { startX: 0, currentX: 0, isDragging: false };

  const applyTransform = (deltaX: number) => {
    const rotation = (deltaX / element.offsetWidth) * maxRotation * 2;
    element.style.transform = `translateX(${deltaX}px) rotate(${rotation}deg)`;
  };

  const getChoice = (index: number): Choice | undefined => {
    return choicesStore.getState().choices[index];
  };

  const handleStart = (x: number) => {
    state.startX = x;
    state.currentX = x;
    state.isDragging = true;
    element.style.transition = "none";
  };

  const handleMove = (x: number) => {
    if (!state.isDragging) return;
    state.currentX = x;
    const deltaX = x - state.startX;
    applyTransform(deltaX);
    if (onMove) onMove(deltaX, threshold);
  };

  const handleEnd = () => {
    if (!state.isDragging) return;
    state.isDragging = false;

    const deltaX = state.currentX - state.startX;
    element.style.transition = "transform 0.3s ease-out";

    if (deltaX < -threshold) {
      element.style.transform = `translateX(-150%) rotate(-${maxRotation}deg)`;
      const choice = getChoice(0);
      if (choice && onSwipeLeft) onSwipeLeft(choice);
    } else if (deltaX > threshold) {
      element.style.transform = `translateX(150%) rotate(${maxRotation}deg)`;
      const choice = getChoice(1);
      if (choice && onSwipeRight) onSwipeRight(choice);
    } else {
      element.style.transform = "translateX(0) rotate(0deg)";
      if (onSwipeCancel) onSwipeCancel();
    }
  };

  const onTouchStart = (e: TouchEvent) => {
    if (e.touches[0]) handleStart(e.touches[0].clientX);
  };
  const onTouchMove = (e: TouchEvent) => {
    if (e.touches[0]) handleMove(e.touches[0].clientX);
  };

  element.addEventListener("touchstart", onTouchStart, { passive: true });
  element.addEventListener("touchmove", onTouchMove, { passive: true });
  element.addEventListener("touchend", handleEnd);

  const onMouseDown = (e: MouseEvent) => {
    handleStart(e.clientX);
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const onMouseUp = () => {
      handleEnd();
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };
  element.addEventListener("mousedown", onMouseDown);

  return () => {
    element.removeEventListener("touchstart", onTouchStart);
    element.removeEventListener("touchmove", onTouchMove);
    element.removeEventListener("touchend", handleEnd);
    element.removeEventListener("mousedown", onMouseDown);
  };
}
