import type { FC } from 'react';

export interface ChoiceComponentProps {
	val?: string;
	onClick: () => void;
	className?: string;
	children?: React.ReactNode;
}

type ChoiceComponent = FC<ChoiceComponentProps>;

class ChoiceComponentsClass {
	private _components: Map<string, ChoiceComponent> = new Map();

	get(type: string): ChoiceComponent | undefined {
		return this._components.get(type);
	}

	register(type: string, component: ChoiceComponent) {
		this._components.set(type, component);
	}

	unregister(type: string) {
		this._components.delete(type);
	}

	clear() {
		this._components.clear();
	}

	has(type: string): boolean {
		return this._components.has(type);
	}
}

export const ChoiceComponents = new ChoiceComponentsClass();