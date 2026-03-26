import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { Patches } from '../src/lib/core/Patches';
import { Tags } from '../src/lib/core/Tags';
import { ChoiceParser } from '../src/lib/core/ChoiceParser';
import { ExternalFunctions } from '../src/lib/core/ExternalFunctions';
import { Parser } from '../src/lib/core/Parser';
import useContents from '../src/lib/stores/contentsStore';
import useChoices from '../src/lib/stores/choicesStore';
import useVariables from '../src/lib/stores/variablesStore';
import useStorage from '../src/lib/features/storage';
import { useStoryImage } from '../src/lib/features/image';
import { AudioController } from '../src/lib/features/audio';

// Mock HTMLMediaElement methods
window.HTMLMediaElement.prototype.pause = vi.fn();
window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);

// 全局测试后清理
afterEach(() => {
	// 清理核心模块状态
	Patches.patches = [];
	// @ts-expect-error accessing private
	Patches._options = {};
	Tags.clear();
	ChoiceParser.clear();
	ExternalFunctions.clear();
	Parser.clear();

	// 清理 stores 状态
	useContents.getState().setContents([]);
	useChoices.setState({ choices: [] });
	useVariables.setState({ variables: new Map() });
	useStorage.setState({ storage: new Map() });

	// 清理 features 状态
	useStoryImage.setState({ image: '' });
	AudioController.cleanupSound();
	AudioController.cleanupMusic();
});