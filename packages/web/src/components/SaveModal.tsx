import { memo, useCallback } from 'react';
import { memory } from '@inkweave/plugins';
import type { SaveModalProps, SaveSlot } from '../types';

const SAVE_SLOTS = [1, 2, 3, 4, 5];

const SaveModal: React.FC<SaveModalProps> = ({
	modalRef,
	type,
	title,
	ink,
	onClose,
}) => {
	const saves = memory.show(title);

	const handleSlotClick = useCallback(
		(index: number) => {
			if (!ink) return;

			if (type === 'save') {
				memory.save(index, ink);
			} else if (type === 'restore' && saves && saves[index]) {
				memory.load(saves[index].data, ink);
			}
			modalRef.current?.close();
			onClose?.();
		},
		[ink, type, saves, modalRef, onClose]
	);

	const handleClose = useCallback(() => {
		modalRef.current?.close();
		onClose?.();
	}, [modalRef, onClose]);

	return (
		<dialog ref={modalRef} className="inkweave-modal">
			<div className="inkweave-modal-header">
				<div className="inkweave-modal-title">
					{type === 'save' ? 'Save Game' : 'Restore Game'}
				</div>
				<button
					className="inkweave-modal-close"
					onClick={handleClose}
					aria-label="Close"
				>
					&times;
				</button>
			</div>
			<div className="inkweave-modal-body">
				{SAVE_SLOTS.map((slot) => {
					const save = saves?.[slot] as SaveSlot | undefined;
					const hasData = !!save;
					const isDisabled = type === 'restore' && !hasData;

					return (
						<button
							key={slot}
							className="inkweave-slot"
							onClick={() => handleSlotClick(slot)}
							disabled={isDisabled}
						>
							<span className="inkweave-slot-name">Slot {slot + 1}</span>
							<span
								className={
									hasData
										? 'inkweave-slot-timestamp'
										: 'inkweave-slot-empty'
								}
							>
								{hasData ? save.timestamp : 'Empty'}
							</span>
						</button>
					);
				})}
			</div>
		</dialog>
	);
};

export default memo(SaveModal);