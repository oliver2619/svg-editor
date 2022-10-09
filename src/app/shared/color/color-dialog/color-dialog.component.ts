import { ChangeDetectionStrategy, Component, EventEmitter } from '@angular/core';
import { Dialog } from '../../modal.service';

@Component({
	selector: 'se-color-dialog',
	templateUrl: './color-dialog.component.html',
	styleUrls: ['./color-dialog.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColorDialogComponent implements Dialog<string> {

	readonly onOk = new EventEmitter<string>();
	readonly onCancel = new EventEmitter<void>();

	title: string = '';
	
	constructor() { }

	init(value: string) {}
	
	ok() {
		this.onOk.emit('ok');
	}

	cancel() {
		this.onCancel.emit();
	}
}
