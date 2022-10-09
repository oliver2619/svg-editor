import { ChangeDetectionStrategy, Component, ViewContainerRef, ComponentRef, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { AbstractDrawTool } from '../tool';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ViewService } from 'src/app/view/view.service';
import { GroupBuilder } from 'src/app/model/svg-builder/group-builder';
import { LineBuilder } from 'src/app/model/svg-builder/line-builder';
import { CircleBuilder } from 'src/app/model/svg-builder/circle-builder';

export class MeasureTool extends AbstractDrawTool {

	private readonly group: GroupBuilder;
	private line: LineBuilder | undefined;
	private circle: CircleBuilder | undefined;
	private component: MeasureComponent | undefined;

	constructor(viewService: ViewService) {
		super(viewService);
		this.group = viewService.measureGroupBuilder;
	}

	cleanUp() {
	}

	createPropertiesComponent(container: ViewContainerRef): ComponentRef<any> | undefined {
		const ret = container.createComponent(MeasureComponent);
		this.component = ret.instance;
		this.component.onClear.subscribe({ next: () => this.group.clearShapes() });
		return ret;
	}

	protected onComplete(startX: number, startY: number, targetX: number, targetY: number): void {
		this.updateComponentValue(this.getLength(startX, startY, targetX, targetY));
		this.line = undefined;
		this.circle = undefined;
	}

	protected onDraw(startX: number, startY: number, targetX: number, targetY: number): void {
		const len = this.getLength(startX, startY, targetX, targetY);
		if (this.line !== undefined) {
			this.line.setLine(startX, startY, targetX, targetY);
		}
		if (this.circle !== undefined) {
			this.circle.setCircle(startX, startY, len);
		}
		this.updateComponentValue(len);
	}

	protected onStart(x: number, y: number): void {
		this.line = this.group.line(x, y, x, y);
		this.line.setClass('measure');
		this.circle = this.group.circle(x, y, 1);
		this.circle.setClass('measure');
	}

	private updateComponentValue(len: number) {
		if (this.component !== undefined) {
			this.component.setValue(len);
		}
	}

	private getLength(startX: number, startY: number, targetX: number, targetY: number): number {
		const dx = targetX - startX;
		const dy = targetY - startY;
		return Math.sqrt(dx * dx + dy * dy);
	}
}

interface MeasureComponentValue {
	length: number;
}

@Component({
	selector: 'se-measure',
	templateUrl: './measure.component.html',
	styleUrls: ['./measure.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeasureComponent {

	readonly onClear = new EventEmitter<void>();

	readonly formGroup: FormGroup;

	constructor(private changeDetectorRef: ChangeDetectorRef, formBuilder: FormBuilder) {
		this.formGroup = formBuilder.group({});
		this.formGroup.addControl('length', formBuilder.control(null, []));
	}

	clear() {
		this.onClear.emit();
	}

	setValue(value: number) {
		const v: MeasureComponentValue = {
			length: Math.round(value * 100) / 100
		};
		this.formGroup.setValue(v);
		this.changeDetectorRef.markForCheck();
	}
}
