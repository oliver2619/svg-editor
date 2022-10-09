import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class LocalStorageService {

	private static readonly PREFIX = 'svg-editor:';

	constructor() { }

	load<T>(key: string): T | undefined {
		const json = localStorage.getItem(`${LocalStorageService.PREFIX}${key}`);
		if (json === null) {
			return undefined;
		}
		return JSON.parse(json);
	}

	save(key: string, value: any) {
		localStorage.setItem(`${LocalStorageService.PREFIX}${key}`, JSON.stringify(value));
	}
}
