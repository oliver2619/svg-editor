import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TextService } from './text.service';

@Directive({
	selector: '[seTitle]'
})
export class TitleDirective implements OnChanges {

	@Input('seTitle')
	text: string | undefined;

	constructor(private readonly element: ElementRef<HTMLElement>, private readonly textService: TextService) { }

	ngOnChanges(changes: SimpleChanges): void {
		this.updateText();
	}

	private updateText() {
		if (this.text !== undefined) {
			this.element.nativeElement.title = this.textService.get(this.text);
		} else {
			this.element.nativeElement.title = '';
		}
	}

}
