import { Directive, ElementRef, OnChanges, Input, SimpleChanges, HostListener } from '@angular/core';
import { TextService } from '../text/text.service';
import { Shortcut } from './shortcut';
import { ModalService } from '../modal.service';

@Directive({
	selector: '[seShortcut]'
})
export class ShortcutDirective implements OnChanges {

	@Input('seShortcut')
	key: string | undefined;

	@Input('seModifier')
	modifier: string | undefined;

	private shortcut: Shortcut | undefined;

	constructor(private readonly element: ElementRef<HTMLElement>, private readonly textService: TextService, private readonly modalService: ModalService) { }

	ngOnChanges(changes: SimpleChanges): void {
		if (this.key !== undefined) {
			if (this.modifier === undefined) {
				this.shortcut = Shortcut.for(this.key);
			} else {
				const m = this.modifier.split(/ +/).map(s => {
					switch (s.toUpperCase()) {
						case 'CTRL':
							return Shortcut.CTRL;
						case 'SHIFT':
							return Shortcut.SHIFT;
						case 'ALT':
							return Shortcut.ALT;
						default:
							throw new RangeError(`Illegal modifier ${s} in shortcut ${this.modifier} ${this.key}`);
					}
				}).reduce((prev, cur) => prev | cur, 0);
				this.shortcut = Shortcut.for(this.key, m);
			}
			this.element.nativeElement.title = `[${this.shortcut.getHelp(this.textService)}]`;
		} else {
			if (this.shortcut !== undefined) {
				this.shortcut = undefined;
				this.element.nativeElement.title = '';
			}
		}
	}

	@HostListener('document:keydown', ['$event'])
	onKeyDown(ev: KeyboardEvent) {
		if (this.modalService.isElementActive(this.element.nativeElement, true) && this.shortcut !== undefined && this.shortcut.matches(ev)) {
			this.element.nativeElement.click();
		}
	}
}
