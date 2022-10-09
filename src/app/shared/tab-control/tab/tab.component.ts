import { ChangeDetectionStrategy, Component, Input, ElementRef } from '@angular/core';

export interface Tab {
	icon: string | undefined;
	title: string | undefined;
	name: string;
}

@Component({
	selector: 'se-tab',
	templateUrl: './tab.component.html',
	styleUrls: ['./tab.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabComponent implements Tab {

	@Input('icon')
	icon: string | undefined;

	@Input('name')
	name: string = '';

	@Input('title')
	title: string | undefined;

	set visible(v: boolean) {
		this.element.nativeElement.style.display = v ? '' : 'none';
	}

	constructor(private readonly element: ElementRef<HTMLElement>) { }
}
