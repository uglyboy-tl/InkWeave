import { memo, useCallback } from "react";
import { Commands } from "../../commands";
import type { CommandButtonProps } from "../../types";

const CommandButton: React.FC<CommandButtonProps> = ({
  commandId,
  ink,
  className = "",
  onRequestOpenModal,
  t,
}) => {
  const command = Commands.get(commandId);

  const handleClick = useCallback(() => {
    if (!command) return;

    if (command.getModalContent && onRequestOpenModal) {
      // Open modal through parent handler
      onRequestOpenModal(commandId);
    } else {
      // Execute default handler
      Commands.execute(commandId, ink);
    }
  }, [commandId, ink, command, onRequestOpenModal]);

  if (!command) {
    console.warn(`CommandButton: Command "${commandId}" not found`);
    return null;
  }

  return (
    <button
      type="button"
      className={`inkweave-command-btn ${className}`.trim()}
      onClick={handleClick}
      title={t(command.name)}
      aria-label={t(command.description)}
    >
      {command.icon ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d={command.icon} />
        </svg>
      ) : (
        t(command.name)
      )}
    </button>
  );
};

export default memo(CommandButton);
