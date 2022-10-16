import { ChangeDetectionStrategy, Component, ViewContainerRef, ComponentRef } from '@angular/core';
import { AbstractMoveTool } from '../tool';
import { ToolMouseEvent } from '../tool-mouse-event';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TextService } from 'src/app/shared/text/text.service';
import { ViewService } from 'src/app/view/view.service';
import { TransformToolHelper } from '../tool-helper';
import { Coordinate } from 'src/app/model/coordinate';

export class ScaleTool extends AbstractMoveTool {

	private readonly toolHelper: TransformToolHelper;
	private pivot = new Coordinate(0, 0);
	private start = new Coordinate(0, 0);

	override get cursor(): string { return 'nesw-resize'; }

	override get selectionPivotVisible() { return true; }

	constructor(private readonly viewService: ViewService) {
		super(true);
		this.toolHelper = new TransformToolHelper(viewService.toolGroupBuilder);
	}

	cleanUp() { }

	createPropertiesComponent(container: ViewContainerRef): ComponentRef<any> | undefined {
		return container.createComponent(ScaleComponent);
	}

	getHint(textService: TextService): string {
		return textService.get('tool.scale.help');
	}

	protected onMouseDown(e: ToolMouseEvent): void {
		this.toolHelper.beginTransform(this.viewService.getSelectedTransformableIds());
		const bb = this.viewService.getSelectionBoundingBox();
		if (bb !== undefined) {
			this.pivot.x = bb.x + bb.width * .5;
			this.pivot.y = bb.y + bb.height * .5;
		}
		this.start = new Coordinate(e.x - this.pivot.x, e.y - this.pivot.y);
	}

	protected onMove(dx: number, dy: number, snapToDiscreteValues: boolean): void {
		const scale = this.getScale(dx, dy, snapToDiscreteValues);
		this.viewService.setEditModeCurrentScale(scale.x, scale.y, this.pivot.x, this.pivot.y);
	}

	protected onMouseUp(dx: number, dy: number, snapToDiscreteValues: boolean): void {
		const scale = this.getScale(dx, dy, snapToDiscreteValues);
		this.viewService.setEditModeCurrentTranslation(0, 0);
		this.toolHelper.end();
		this.viewService.scaleSelected(scale.x, scale.y, this.pivot.x, this.pivot.y);
	}

	private getScale(dx: number, dy: number, snapToDiscreteValues: boolean): Coordinate {
		if (snapToDiscreteValues) {
			return new Coordinate(this.start.x != 0 ? (this.start.x + dx) / this.start.x : 1, this.start.y !== 0 ? (this.start.y + dy) / this.start.y : 1);
		} else {
			const start = this.start.x * this.start.x + this.start.y * this.start.y;
			const end = (this.start.x + dx) * (this.start.x + dx) + (this.start.y + dy) * (this.start.y + dy);
			const f = start !== 0 ? Math.sqrt(end / start) : 1;
			return new Coordinate(f, f);
		}
	}
}

interface ScaleComponentValue {
	x: number;
	y: number;
}

@Component({
	selector: 'se-scale',
	templateUrl: './scale.component.html',
	styleUrls: ['./scale.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScaleComponent {

	readonly formGroup: FormGroup;

	get canScale(): boolean {
		return this.formGroup.valid;
	}

	constructor(private readonly viewService: ViewService, formBuilder: FormBuilder) {
		this.formGroup = formBuilder.group({});
		this.formGroup.addControl('x', formBuilder.control(100, [Validators.required]));
		this.formGroup.addControl('y', formBuilder.control(100, [Validators.required]));
	}

	scale() {
		const bb = this.viewService.getSelectionBoundingBox();
		if (bb !== undefined) {
			const value: ScaleComponentValue = this.formGroup.value;
			const px = bb.x + bb.width * .5;
			const py = bb.y + bb.height * .5;
			this.viewService.scaleSelected(value.x / 100, value.y / 100, px, py);
		}
	}
}
