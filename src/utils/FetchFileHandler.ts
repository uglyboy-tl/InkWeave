import { IFileHandler } from 'inkjs/compiler/IFileHandler';

export interface FetchFileHandlerOptions {
	basePath?: string;
	fetchOptions?: RequestInit;
}

export class FetchFileHandler implements IFileHandler {
	private basePath: string;

	constructor(options: FetchFileHandlerOptions = {}) {
		this.basePath = options.basePath || '';
	}

	readonly ResolveInkFilename = (filename: string): string => {
		if (this.basePath) {
			return this.basePath + '/' + filename;
		}
		return filename;
	};

	readonly LoadInkFileContents = (filename: string): string => {
		const resolvedPath = this.ResolveInkFilename(filename);

		// Note: Synchronous XHR is required by inkjs Compiler API
		// which expects synchronous file loading. This blocks the main thread
		// during story compilation. Consider pre-compiling ink files for production.
		const xhr = new XMLHttpRequest();
		xhr.open('GET', resolvedPath, false);
		xhr.send();

		if (xhr.status !== 200) {
			throw new Error(`Failed to load file: ${resolvedPath} (status ${xhr.status})`);
		}

		return xhr.responseText;
	};
}