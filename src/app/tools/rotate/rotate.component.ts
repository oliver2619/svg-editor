import { ChangeDetectionStrategy, Component, ComponentRef, ViewContainerRef } from '@angular/core';
import { ToolMouseEvent } from '../tool-mouse-event';
import { AbstractMoveTool } from '../tool';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TextService } from 'src/app/shared/text/text.service';
import { TransformToolHelper } from '../tool-helper';
import { ViewService } from 'src/app/view/view.service';
import { Coordinate } from 'src/app/model/coordinate';

export class RotateTool extends AbstractMoveTool {

	private readonly toolHelper: TransformToolHelper;
	private pivot = new Coordinate(0, 0);
	private start: Coordinate | undefined;

	override get selectionPivotVisible() { return true; }

	constructor(private readonly viewService: ViewService) {
		super(true);
		this.toolHelper = new TransformToolHelper(viewService.toolGroupBuilder);
	}

	cleanUp() { }

	createPropertiesComponent(container: ViewContainerRef): ComponentRef<any> | undefined {
		return container.createComponent(RotateComponent);
	}

	getHint(textService: TextService): string {
		return textService.get('tool.rotate.hint');
	}

	protected onMouseDown(e: ToolMouseEvent): void {
		this.toolHelper.beginTransform(this.viewService.getSelectedTransformableIds());
		const bb = this.viewService.getSelectionBoundingBox();
		if (bb !== undefined) {
			this.pivot.x = bb.x + bb.width * .5;
			this.pivot.y = bb.y + bb.height * .5;
		}
		this.start = new Coordinate(e.x, e.y);
	}

	protected onMove(dx: number, dy: number, snapToDiscreteValues: boolean): void {
		const angle = this.getAngle(dx, dy, snapToDiscreteValues);
		this.viewService.setEditModeCurrentRotation(angle, this.pivot.x, this.pivot.y);
	}

	protected onMouseUp(dx: number, dy: number, snapToDiscreteValues: boolean): void {
		const angle = this.getAngle(dx, dy, snapToDiscreteValues);
		this.viewService.setEditModeCurrentTranslation(0, 0);
		this.toolHelper.end();
		this.start = undefined;
		this.viewService.rotateSelected(angle, this.pivot.x, this.pivot.y);
	}

	private getAngle(dx: number, dy: number, discrete: boolean): number {
		if (this.start !== undefined) {
			const dx1 = this.start.x - this.pivot.x;
			const dy1 = this.start.y - this.pivot.y;
			const d1 = dx1 * dx1 + dy1 * dy1;
			const dx2 = (this.start.x + dx) - this.pivot.x;
			const dy2 = (this.start.y + dy) - this.pivot.y;
			const d2 = dx2 * dx2 + dy2 * dy2;
			const d = d1 * d2;
			if (d !== 0) {
				const f = 1 / Math.sqrt(d);
				const tp = (dx1 * dx2 + dy1 * dy2) * f;
				const cp = (dx1 * dy2 - dy1 * dx2) * f;
				const angle = Math.atan2(cp, tp) * 180 / Math.PI;
				return discrete ? Math.round(angle / 15) * 15 : angle;
			} else {
				return 0;
			}
		} else {
			return 0;
		}
	}
}

interface RotateComponentValue {
	angle: number;
}

@Component({
	selector: 'se-rotate',
	templateUrl: './rotate.component.html',
	styleUrls: ['./rotate.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class RotateComponent {

	readonly formGroup: FormGroup;

	get canRotate(): boolean {
		return this.formGroup.valid;
	}

	constructor(private readonly viewService: ViewService, formBuilder: FormBuilder) {
		this.formGroup = formBuilder.group({});
		this.formGroup.addControl('angle', formBuilder.control(0, [Validators.required]));
	}

	rotate() {
		const bb = this.viewService.getSelectionBoundingBox();
		if (bb !== undefined) {
			const px = bb.x + bb.width * .5;
			const py = bb.y + bb.height * .5;
			const value: RotateComponentValue = this.formGroup.value;
			this.viewService.rotateSelected(value.angle, px, py);
		}
	}
}
