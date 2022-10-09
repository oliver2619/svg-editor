import { ChangeDetectionStrategy, Component, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Dialog } from 'src/app/shared/modal.service';
import { LinePattern } from 'src/app/model/line-properties';
import { DialogAction } from 'src/app/shared/dialog/dialog.component';
import { TextService } from 'src/app/shared/text/text.service';

@Component({
	selector: 'se-dash-array-dialog',
	templateUrl: './dash-array-dialog.component.html',
	styleUrls: ['./dash-array-dialog.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashArrayDialogComponent implements Dialog<LinePattern>, AfterViewInit {

	@ViewChild('line')
	line: ElementRef<SVGLineElement> | undefined

	readonly onOk = new EventEmitter<LinePattern>();
	readonly onCancel = new EventEmitter<void>();
	readonly additionalButtons: DialogAction[] = [{
		name: this.textService.get('reset'),
		action: () => { this.reset(); }
	}];

	array: number[] = [];
	title: string = '';

	private width: number = 0;

	constructor(private readonly textService: TextService) { }

	ngAfterViewInit(): void {
		this.updateSvg();
	}

	init(value: LinePattern): void {
		this.array = value.array.slice(0);
		this.width = value.width;
	}

	ok() {
		this.onOk.emit(new LinePattern(this.array, this.width));
	}

	cancel() {
		this.onCancel.emit();
	}

	onChange(i: number, ev: Event) {
		const v = Number.parseFloat((ev.target as HTMLInputElement).value);
		if (isNaN(v) || v <= 0) {
			(ev.target as HTMLInputElement).value = String(this.array[i]);
		} else {
			this.array[i] = v;
			this.updateSvg();
		}
	}

	add() {
		this.array = [...this.array];
		this.array.push(1);
		this.updateSvg();
	}

	remove(i: number) {
		this.array = [...this.array];
		this.array.splice(i, 1);
		this.updateSvg();
	}

	reset() {
		this.array = [];
		this.updateSvg();
	}

	preset(array: number[]) {
		this.array = array.slice(0);
		this.updateSvg();
	}
	
	private updateSvg() {
		if (this.line !== undefined) {
			if (this.array.length === 0) {
				this.line.nativeElement.removeAttribute("stroke-dasharray");
			} else {
				const arr = this.array.map(it => it * 3).join(',');
				this.line.nativeElement.setAttribute("stroke-dasharray", arr);
			}
		}
	}
}
