import type { InkStory } from '@inkweave/core';
import type { SaveSlot as PluginSaveSlot } from '@inkweave/plugins';

export interface InkWeaveOptions {
	container: string | HTMLElement;
	story: string;
	title?: string;
	lineDelay?: number;
	basePath?: string;
	theme?: 'light' | 'dark';
}

export type SaveSlot = PluginSaveSlot;

export interface SaveModalProps {
	modalRef: React.RefObject<HTMLDialogElement | null>;
	type: 'save' | 'restore';
	title: string;
	ink: InkStory | null;
	onClose?: () => void;
}

export interface MenuProps {
	onSave: () => void;
	onRestore: () => void;
	onRestart: () => void;
}

export interface ContainerProps {
	ink: InkStory;
	lineDelay?: number;
	title?: string;
}