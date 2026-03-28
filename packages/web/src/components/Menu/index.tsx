import { memo } from 'react';
import type { MenuProps } from '../../types';
import styles from './styles.module.css';

const RestoreIcon = memo(() => (
	<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
		<path d="M12 3a9 9 0 0 0-9 9H0l4 4 4-4H5a7 7 0 1 1 2.05 4.95l-1.41 1.41A9 9 0 1 0 12 3z"/>
		<path d="M13 8v5l4.25 2.52.77-1.28-3.52-2.09V8z"/>
	</svg>
));
RestoreIcon.displayName = 'RestoreIcon';

const SaveIcon = memo(() => (
	<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
		<path d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
	</svg>
));
SaveIcon.displayName = 'SaveIcon';

const RestartIcon = memo(() => (
	<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
		<path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
	</svg>
));
RestartIcon.displayName = 'RestartIcon';

const Menu: React.FC<MenuProps> = ({ onSave, onRestore, onRestart }) => {
	return (
		<nav className={styles.nav}>
			<div className={styles.actions}>
				<button
					className={styles.btn}
					onClick={onRestore}
					title="Restore"
					aria-label="Restore saved game"
				>
					<RestoreIcon />
				</button>
				<button
					className={styles.btn}
					onClick={onSave}
					title="Save"
					aria-label="Save game"
				>
					<SaveIcon />
				</button>
				<button
					className={styles.btn}
					onClick={onRestart}
					title="Restart"
					aria-label="Restart game"
				>
					<RestartIcon />
				</button>
			</div>
		</nav>
	);
};

export default memo(Menu);
