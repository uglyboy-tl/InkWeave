import { CommandRegistry } from "@inkweave/core";
import type { CommandButtonProps } from "../../types";

const CommandButton = (props: CommandButtonProps) => {
  const command = CommandRegistry.get(props.commandId);

  const handleClick = () => {
    if (!command) return;

    if (command.getModalContent && props.onRequestOpenModal) {
      props.onRequestOpenModal(props.commandId);
    } else {
      CommandRegistry.execute(props.commandId, props.ink);
    }
  };

  if (!command) {
    console.warn(`CommandButton: Command "${props.commandId}" not found`);
    return null;
  }

  return (
    <button
      type="button"
      class={`inkweave-command-btn ${props.class}`.trim()}
      onClick={handleClick}
      title={props.t(command.name)}
      aria-label={props.t(command.description)}
    >
      {command.icon ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d={command.icon} />
        </svg>
      ) : (
        props.t(command.name)
      )}
    </button>
  );
};

export default CommandButton;
