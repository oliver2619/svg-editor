import { ChangeDetectionStrategy, Component, EventEmitter } from '@angular/core';
import { Color } from 'src/app/model/color/color';
import { SingleColor } from 'src/app/model/color/single-color';
import { Dialog } from '../../modal.service';

@Component({
	selector: 'se-color-dialog',
	templateUrl: './color-dialog.component.html',
	styleUrls: ['./color-dialog.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColorDialogComponent implements Dialog<SingleColor> {

	readonly onOk = new EventEmitter<SingleColor>();
	readonly onCancel = new EventEmitter<void>();

	title: string = '';

	singleColor: SingleColor = new SingleColor(1, 1, 1, 1);

	constructor() { }

	init(value: SingleColor) { this.singleColor = value; }

	ok() {
		this.onOk.emit(this.singleColor);
	}

	cancel() {
		this.onCancel.emit();
	}

	onSingleColorChange(ev: SingleColor) {
		this.singleColor = ev;
	}
}
