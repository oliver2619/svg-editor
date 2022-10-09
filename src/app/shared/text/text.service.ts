import { Injectable } from '@angular/core';
import { Dictionary } from './dictionary';
import { DICTIONARY_DE } from './lang/text-de';
import { DICTIONARY_EN } from './lang/text-en';

@Injectable({
	providedIn: 'root'
})
export class TextService {

	private readonly dictionary: Dictionary;

	constructor() {
		this.dictionary = TextService.getDictionaryByLanguage();
	}

	get(text: string, ...params: any[]): string {
		const ret = this.dictionary[text];
		if (ret === undefined) {
			console.warn(`Text ${text} not found in text-service`);
			return text;
		}
		return ret;
	}

	private static getDictionaryByLanguage(): Dictionary {
		const lang = navigator.language;
		const result = /^([^\-]+)/.exec(lang);
		if (result !== null) {
			if (result[1] === 'de') {
				return DICTIONARY_DE;
			}
		}
		return DICTIONARY_EN;
	}
}
