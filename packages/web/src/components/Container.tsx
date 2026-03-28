import { memo, useRef, useCallback, useState } from 'react';
import { Story, Contents, Choices } from '@inkweave/react';
import { Image } from '@inkweave/plugins';
import type { ContainerProps } from '../types';
import Menu from './Menu';
import SaveModal from './SaveModal';

const Container: React.FC<ContainerProps> = ({ ink, lineDelay = 0.05, title }) => {
	const [modalType, setModalType] = useState<'save' | 'restore'>('save');
	const modalRef = useRef<HTMLDialogElement | null>(null);

	const openModal = useCallback((type: 'save' | 'restore') => {
		setModalType(type);
		modalRef.current?.showModal();
	}, []);

	const handleSave = useCallback(() => {
		openModal('save');
	}, [openModal]);

	const handleRestore = useCallback(() => {
		openModal('restore');
	}, [openModal]);

	const handleRestart = useCallback(() => {
		ink.restart();
	}, [ink]);

	const storyTitle = ink.title || title || '';

	return (
		<div className="inkweave-container">
			<Menu
				onSave={handleSave}
				onRestore={handleRestore}
				onRestart={handleRestart}
			/>
			<div className="inkweave-content">
				<Story ink={ink}>
					<Image />
					<Contents lineDelay={lineDelay} />
					<Choices />
				</Story>
			</div>
			<SaveModal
				modalRef={modalRef}
				type={modalType}
				title={storyTitle}
				ink={ink}
			/>
		</div>
	);
};

export default memo(Container);