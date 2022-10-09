import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
	selector: 'se-error-message',
	templateUrl: './error-message.component.html',
	styleUrls: ['./error-message.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorMessageComponent {

	@Input('message')
	message: string = '';

	@Output('close')
	onClose = new EventEmitter<void>();

	constructor() { }

	@HostListener('click')
	closeClicked() {
		this.onClose.next();
	}
}
