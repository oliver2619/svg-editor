import { TextService } from '../text/text.service';

export abstract class Shortcut {

	static readonly CTRL = 1;
	static readonly SHIFT = 2;
	static readonly ALT = 4;

	protected constructor(private readonly modifier?: number) { }

	static for(codeOrKey: string, modifier?: number): Shortcut {
		if (codeOrKey.startsWith('code:')) {
			return this.forCode(codeOrKey.substring(5), modifier);
		} else if (codeOrKey.startsWith('key:')) {
			return this.forKey(codeOrKey.substring(4), modifier);
		} else {
			throw new RangeError(`codeOrKey must be prefixed with code: or key:`);
		}
	}

	static forCode(code: string, modifier?: number): Shortcut { return new CodeShortcut(code, modifier); }

	static forKey(key: string, modifier?: number): Shortcut { return new KeyShortcut(key, modifier); }

	abstract getHelp(textService: TextService): string;

	abstract matches(ev: KeyboardEvent): boolean;

	protected matchesModifier(ev: KeyboardEvent): boolean {
		if (this.modifier === undefined) {
			return true;
		}
		if (((this.modifier & Shortcut.CTRL) === Shortcut.CTRL) !== ev.ctrlKey) {
			return false;
		}
		if (((this.modifier & Shortcut.SHIFT) === Shortcut.SHIFT) !== ev.shiftKey) {
			return false;
		}
		return ((this.modifier & Shortcut.ALT) === Shortcut.ALT) === ev.altKey;
	}

	protected modifierToText(textService: TextService): string {
		let ret: string[] = [];
		if (this.modifier === undefined) {
			return '';
		}
		if ((this.modifier & Shortcut.ALT) === Shortcut.ALT) {
			ret.push(textService.get('shortcut.alt'));
		}
		if ((this.modifier & Shortcut.CTRL) === Shortcut.CTRL) {
			ret.push(textService.get('shortcut.ctrl'));
		}
		if ((this.modifier & Shortcut.SHIFT) === Shortcut.SHIFT) {
			ret.push(textService.get('shortcut.shift'));
		}
		return ret.join('+');
	}
}

class KeyShortcut extends Shortcut {

	private readonly key: string;
	
	constructor(key: string, modifier?: number) {
		super(modifier);
		this.key = key.toUpperCase();
	}

	getHelp(textService: TextService): string {
		const mod = this.modifierToText(textService);
		return mod !== '' ? `${mod}+${this.key}` : this.key;
	}

	matches(ev: KeyboardEvent): boolean {
		if (ev.key.toUpperCase() !== this.key) {
			return false;
		}
		return this.matchesModifier(ev);
	}

}

class CodeShortcut extends Shortcut {

	constructor(private readonly code: string, modifier?: number) {
		super(modifier);
	}

	getHelp(textService: TextService): string {
		const mod = this.modifierToText(textService);
		const key = this.codeToText(textService);
		return mod !== '' ? `${mod}+${key}` : key;
	}

	matches(ev: KeyboardEvent): boolean {
		if (ev.code !== this.code) {
			return false;
		}
		return this.matchesModifier(ev);
	}

	private codeToText(textService: TextService): string {
		switch (this.code) {
			case 'Delete':
				return textService.get('shortcut.delete');
			case 'Enter':
				return textService.get('shortcut.enter');
			case 'PageDown':
				return textService.get('shortcut.pageDown');
			case 'PageUp':
				return textService.get('shortcut.pageUp');
			default:
				if (this.code.startsWith('Key')) {
					return this.code.substring(3);
				} else if (this.code.startsWith('Digit')) {
					return this.code.substring(5);
				} else if (this.code.startsWith('Numpad')) {
					return `Num ${this.code.substring(6)}`;
				} else {
					return this.code;
				}
		}
	}
}
