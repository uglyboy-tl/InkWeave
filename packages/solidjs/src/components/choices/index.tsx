import { type Choice, ChoiceRegistry as ChoiceRegistryClass, choicesStore } from "@inkweave/core";
import {
  createEffect,
  createMemo,
  createSignal,
  For,
  type JSX,
  onCleanup,
  onMount,
} from "solid-js";
import { useStory } from "../story";
import styles from "./styles.module.css";

export interface ChoiceComponentProps {
  choice: Choice;
  onClick: () => void;
  class?: string;
  children?: JSX.Element;
}

export type ChoiceComponent = (props: ChoiceComponentProps) => JSX.Element;

export const ChoiceRegistry = new ChoiceRegistryClass<ChoiceComponent>();

interface ChoiceItemProps {
  choice: Choice;
  index: number;
  onClick: (index: number) => void;
}

const ChoiceItem = (props: ChoiceItemProps) => {
  const classList = () => {
    const list = [...props.choice.classes, styles.button, "inkweave-choice"];
    if (props.choice.type === "unclickable" && styles.disabled) {
      list.push(styles.disabled);
    }
    return [...new Set(list)].join(" ");
  };

  const handleClick = () => {
    if (props.choice.type !== "unclickable") {
      props.onClick(props.choice.index);
    }
  };

  const Component = ChoiceRegistry.get(props.choice.type);

  if (Component) {
    return (
      <li class={styles.item} style={{ "--index": props.index } as Record<string, string | number>}>
        <Component choice={props.choice} onClick={handleClick} class={classList()}>
          {props.choice.text}
        </Component>
      </li>
    );
  }

  return (
    <li class={styles.item} style={{ "--index": props.index } as Record<string, string | number>}>
      <a
        onClick={handleClick}
        class={classList()}
        aria-disabled={props.choice.type === "unclickable"}
      >
        {props.choice.text}
      </a>
    </li>
  );
};

const ChoicesComponent = () => {
  const ink = useStory();
  const [version, setVersion] = createSignal(0);

  onMount(() => {
    setVersion(1);
    const unsub = choicesStore.subscribe(() => {
      setVersion((v) => v + 1);
    });
    onCleanup(unsub);
  });

  const choices = createMemo(() => {
    version();
    return choicesStore.getState().choices;
  });

  const canShow = createMemo(() => {
    version();
    return choicesStore.getState().choicesVisible;
  });

  let ulRef: HTMLUListElement | undefined;

  createEffect(() => {
    if (canShow() && ulRef) {
      ulRef.style.animation = "none";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (ulRef) ulRef.style.animation = "";
        });
      });
    }
  });

  const handleClick = (index: number) => {
    ink.choose(index);
  };

  return (
    <ul
      ref={ulRef}
      data-inkweave="choices"
      class={`inkweave-choices ${styles.choices}`}
      style={{ visibility: canShow() ? "visible" : "hidden" }}
    >
      <For each={choices()}>
        {(choice, index) => <ChoiceItem choice={choice} index={index()} onClick={handleClick} />}
      </For>
    </ul>
  );
};

export default ChoicesComponent;
