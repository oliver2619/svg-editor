import { ChangeDetectionStrategy, Component, Input, AfterViewInit, OnDestroy, ContentChild } from '@angular/core';
import { ContextMenuComponent } from '../context-menu/context-menu.component';

@Component({
	selector: 'se-dropdown',
	templateUrl: './dropdown.component.html',
	styleUrls: ['./dropdown.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownComponent implements AfterViewInit, OnDestroy {

	@Input('button')
	button: HTMLElement | undefined;

	@Input('align')
	align: string = 'bottom right';

	@ContentChild(ContextMenuComponent)
	contextMenu: ContextMenuComponent | undefined;

	private readonly onButtonClick = (ev: MouseEvent) => {
		if (this.contextMenu !== undefined && this.button !== undefined) {
			this.contextMenu.showRelativeTo(this.button, this.align);
		}
	};

	constructor() { }

	ngAfterViewInit(): void {
		if (this.button !== undefined) {
			this.button.addEventListener('click', this.onButtonClick);
		}
	}

	ngOnDestroy(): void {
		if (this.button !== undefined) {
			this.button.removeEventListener('click', this.onButtonClick);
		}
	}

}
