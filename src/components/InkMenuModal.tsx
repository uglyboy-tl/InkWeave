import { memo } from 'react';
import { useStory } from '@lib/stores';
import { memory, useStorage } from '@lib/features'

const SLOTS = [0, 1, 2, 3, 4];

interface InkMenuModalProps {
	modalRef: React.RefObject<HTMLDialogElement | null>;
	type: string;
	title: string;
}

const InkMenuModal: React.FC<InkMenuModalProps> = ({
	modalRef,
	type,
	title,
}) => {
	const storage = useStorage((s: { storage: Map<string, any[]> }) => s.storage);
	const saves = storage.get(title);

	const close = () => modalRef.current?.close();

	return (
		<dialog ref={modalRef} className="ink-modal">
			<div className="ink-modal-header">
				<span className="ink-modal-title">
					{type === 'save' ? 'Save Game' : 'Load Game'}
				</span>
				<button className="ink-modal-close" onClick={close}>
					✕
				</button>
			</div>
			<div className="ink-modal-body">
				{SLOTS.map((item) => {
					const save = saves?.[item];
					const isDisabled = type === 'restore' && !save;

					return (
						<button
							key={item}
							className="ink-slot"
							disabled={isDisabled}
							onClick={() => {
								const ink = useStory.getState().ink;
								if (!ink) return;
								if (type === 'save') {
									memory.save(item, ink);
									close();
								} else if (save) {
									memory.load(save.data, ink);
									close();
								}
							}}
						>
							<span className="ink-slot-name">
								Slot {item + 1}
							</span>
							<span className="ink-slot-timestamp">
								{save?.timestamp ?? 'Empty'}
							</span>
						</button>
					);
				})}
			</div>
		</dialog>
	);
};

export default memo(InkMenuModal);