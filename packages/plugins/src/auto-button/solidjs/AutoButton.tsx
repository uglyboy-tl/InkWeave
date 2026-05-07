import type { ChoiceComponentProps } from "@inkweave/solidjs";
import { onCleanup, onMount } from "solid-js";

const AutoChoice = (props: ChoiceComponentProps) => {
  let intervalRef: ReturnType<typeof setInterval> | null = null;

  const cd = parseFloat(props.choice.val ?? "") || 0;

  onMount(() => {
    if (cd <= 0) return;

    intervalRef = setInterval(() => {
      props.onClick();
    }, cd * 1000);
  });

  onCleanup(() => {
    if (intervalRef) {
      clearInterval(intervalRef);
    }
  });

  return (
    <a class={props.class} style={{ display: "none" }}>
      {props.children}
    </a>
  );
};

export default AutoChoice;
