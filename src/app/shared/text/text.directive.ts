import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TextService } from './text.service';

@Directive({
	selector: '[seText]'
})
export class TextDirective implements OnChanges {

	@Input('seText')
	text: string | undefined;

	@Input('seAccessKey')
	accessKey: any = undefined;

	constructor(private readonly element: ElementRef<HTMLElement>, private readonly textService: TextService) { }

	ngOnChanges(changes: SimpleChanges): void {
		this.updateText();
	}

	private updateText() {
		if (this.text !== undefined) {
			const txt = this.textService.get(this.text);
			if (this.accessKey !== undefined && this.accessKey !== false) {
				this.element.nativeElement.innerHTML = `<b>${txt[0]}</b>${txt.slice(1)}`;
			} else {
				this.element.nativeElement.innerHTML = txt;
			}
		} else {
			this.element.nativeElement.innerHTML = '';
		}
	}
}
