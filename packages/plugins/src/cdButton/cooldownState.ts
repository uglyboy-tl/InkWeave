// 存储所有 cd 按钮的冷却状态
const cooldownStates = new Map<string, number>();

export function getCooldownKey(choice: { type: string; text: string; val?: string }): string {
	return `${choice.type}_${choice.text}_${choice.val || ''}`;
}

export function isCooldownActive(key: string): boolean {
	const cooldownUntil = cooldownStates.get(key) || 0;
	return Date.now() < cooldownUntil;
}

export function getRemainingSeconds(key: string): number {
	const cooldownUntil = cooldownStates.get(key) || 0;
	const remainingMs = Math.max(0, cooldownUntil - Date.now());
	return Math.ceil(remainingMs / 1000);
}

export function setCooldown(key: string, seconds: number): void {
	cooldownStates.set(key, Date.now() + seconds * 1000);
}