import type { ChoiceComponentProps } from "@inkweave/solidjs";
import { choiceStyles, useStory } from "@inkweave/solidjs";
import { createSignal, onCleanup, onMount } from "solid-js";
import {
  getCooldownKey,
  getRemainingSeconds,
  isCooldownActive,
  setCooldown,
} from "../cooldownState";

const CooldownChoice = (props: ChoiceComponentProps) => {
  const cd = parseFloat(props.choice.val || "0");
  const key = getCooldownKey(props.choice);
  const ink = useStory();
  const [tick, setTick] = createSignal(0);

  onMount(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
      if (!isCooldownActive(key)) clearInterval(interval);
    }, 200);
    onCleanup(() => clearInterval(interval));
  });

  const isDisabled = () => {
    tick();
    return isCooldownActive(key);
  };
  const remainingSeconds = () => {
    tick();
    return getRemainingSeconds(key);
  };

  const handleClick = () => {
    if (isDisabled()) return;
    setCooldown(key, cd);
    setTick((t) => t + 1);
    props.onClick();
  };

  const buttonClass = () =>
    isDisabled() && choiceStyles.disabled
      ? `${props.class} ${choiceStyles.disabled}`.trim()
      : props.class;

  const template = (ink.options.cdTemplate as string) || "{text} ({time})";
  const displayText = () =>
    isDisabled() && remainingSeconds() > 0
      ? template
          .replace("{text}", String(props.children))
          .replace("{time}", String(remainingSeconds()))
      : props.children;

  return (
    <a class={buttonClass()} onClick={handleClick} aria-disabled={isDisabled()}>
      {displayText()}
    </a>
  );
};

export default CooldownChoice;
