import { memo, useRef, useState, useCallback } from 'react';
import { useStory } from '@lib/stores';
import InkMenuModal from './InkMenuModal';

const InkMenu: React.FC = () => {
	const [type, setType] = useState<string>('');
	const [title, setTitle] = useState<string>('');
	const modalRef = useRef<HTMLDialogElement | null>(null);

	const openModal = useCallback((type: string) => {
		if (modalRef.current && type) {
			setTitle(useStory.getState().ink?.title || '');
			modalRef.current.showModal();
		}
		setType(type);
	}, []);

	return (
		<nav className="ink-nav">
			<div className="ink-nav-title"></div>
			<div className="ink-nav-actions">
				<button
					className="ink-nav-btn"
					onClick={() => openModal('restore')}
					title="Load"
				>
					<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
						<path d="M12 3v9.28a4.39 4.39 0 0 0-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z" />
					</svg>
				</button>
				<button
					className="ink-nav-btn"
					onClick={() => openModal('save')}
					title="Save"
				>
					<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
						<path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />
					</svg>
				</button>
				<button
					className="ink-nav-btn"
					onClick={() => useStory.getState().ink?.restart()}
					title="Restart"
				>
					<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
						<path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
					</svg>
				</button>
			</div>
			<InkMenuModal modalRef={modalRef} type={type} title={title} />
		</nav>
	);
};

export default memo(InkMenu);