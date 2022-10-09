import { ChangeDetectionStrategy, Component, EventEmitter } from '@angular/core';
import { Dialog } from '../../modal.service';
import { DialogAction } from '../../dialog/dialog.component';
import { TextService } from '../../text/text.service';
import { Color, ColorType } from 'src/app/model/color/color';
import { SingleColor } from 'src/app/model/color/single-color';
import { NoColor } from 'src/app/model/color/no-color';
import { ContextColor } from 'src/app/model/color/context-color';

@Component({
	selector: 'se-color-pattern-dialog',
	templateUrl: './color-pattern-dialog.component.html',
	styleUrls: ['./color-pattern-dialog.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColorPatternDialogComponent implements Dialog<Color> {

	readonly onOk = new EventEmitter<Color>();
	readonly onCancel = new EventEmitter<void>();
	readonly additionalButtons: DialogAction[] = [{
		name: this.textService.get('colorDialog.none'),
		action: () => this.none(),
		active: () => this.isNone
	}, {
		name: this.textService.get('colorDialog.context'),
		action: () => this.fromContext(),
		active: () => this.isFromContext
	}];

	title: string = '';

	private oldColor: Color = NoColor.INSTANCE;
	private newColor: Color = NoColor.INSTANCE;

	get isFromContext(): boolean {
		return this.oldColor.type === ColorType.CONTEXT;
	}

	get isNone(): boolean {
		return this.oldColor.type === ColorType.NONE;
	}

	get singleColor(): SingleColor | undefined {
		if (this.oldColor.type === ColorType.SINGLE) {
			return this.oldColor as SingleColor;
		} else {
			return undefined;
		}
	}

	constructor(private readonly textService: TextService) { }

	init(value: Color) {
		this.oldColor = value;
		this.newColor = value;
	}

	ok() {
		this.onOk.emit(this.newColor);
	}

	cancel() {
		this.onCancel.emit();
	}

	none() {
		this.onOk.emit(NoColor.INSTANCE);
	}

	fromContext() {
		this.onOk.emit(ContextColor.INSTANCE);
	}

	onSingleColorChange(ev: SingleColor) {
		this.newColor = ev;
	}
}
