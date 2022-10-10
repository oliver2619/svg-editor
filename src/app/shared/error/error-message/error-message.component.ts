import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
	selector: 'se-error-message',
	templateUrl: './error-message.component.html',
	styleUrls: ['./error-message.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorMessageComponent implements OnInit, OnDestroy {

	private static readonly DURATION_S = 20;

	@Input('message')
	message: string = '';

	@Output('close')
	onClose = new EventEmitter<void>();

	private closeTimeout: number | undefined;
	
	constructor() { }

	@HostListener('click')
	closeClicked() {
		this.onClose.next();
	}

	ngOnInit() {
		this.closeTimeout = window.setTimeout(() => {
			this.closeTimeout = undefined;
			this.onClose.next();
		}, ErrorMessageComponent.DURATION_S * 1000);
	}

	ngOnDestroy() {
		if (this.closeTimeout !== undefined) {
			window.clearTimeout(this.closeTimeout);
			this.closeTimeout = undefined;
		}
	}
}
