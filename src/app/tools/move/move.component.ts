import { ChangeDetectionStrategy, Component, ViewContainerRef, ComponentRef } from '@angular/core';
import { ToolMouseEvent } from '../tool-mouse-event';
import { AbstractMoveTool } from '../tool';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ViewService } from 'src/app/view/view.service';
import { TextService } from 'src/app/shared/text/text.service';
import { TransformToolHelper } from '../tool-helper';

export class MoveTool extends AbstractMoveTool {

	private readonly toolHelper: TransformToolHelper;

	constructor(private readonly viewService: ViewService) {
		super(true);
		this.toolHelper = new TransformToolHelper(viewService.toolGroupBuilder);
	}

	cleanUp() {
	}

	createPropertiesComponent(container: ViewContainerRef): ComponentRef<any> | undefined {
		return container.createComponent(MoveComponent);
	}

	getHint(textService: TextService): string {
		return textService.get('tool.move.hint');
	}

	protected onMouseDown(e: ToolMouseEvent): void {
		this.toolHelper.beginTransform(this.viewService.getSelectedTransformableIds());
	}

	protected onMove(dx: number, dy: number, snapToDiscreteValues: boolean): void {
		if (snapToDiscreteValues) {
			const r = this.getDiscreteValue(dx, dy);
			this.viewService.setEditModeCurrentTranslation(r.x, r.y);
		} else if (this.viewService.snapToGrid) {
			const r = this.getSnappedValue(dx, dy);
			this.viewService.setEditModeCurrentTranslation(r.x, r.y);
		} else {
			this.viewService.setEditModeCurrentTranslation(dx, dy);
		}
	}

	protected onMouseUp(dx: number, dy: number, snapToDiscreteValues: boolean): void {
		this.viewService.setEditModeCurrentTranslation(0, 0);
		this.toolHelper.end();
		if (snapToDiscreteValues) {
			const r = this.getDiscreteValue(dx, dy);
			this.viewService.translateSelected(r.x, r.y);
		} else if (this.viewService.snapToGrid) {
			const r = this.getSnappedValue(dx, dy);
			this.viewService.translateSelected(r.x, r.y);
		} else {
			this.viewService.translateSelected(dx, dy);
		}
	}

	private getDiscreteValue(dx: number, dy: number): { x: number, y: number } {
		const d = Math.sqrt(dx * dx + dy * dy);
		let angle = (Math.atan2(dy, dx) + Math.PI * 2) * 180 / Math.PI;
		angle = Math.round(angle / 15) * 15 * Math.PI / 180;
		return {
			x: d * Math.cos(angle),
			y: d * Math.sin(angle)
		};
	}

	private getSnappedValue(dx: number, dy: number): { x: number, y: number } {
		const gs = this.viewService.gridSize;
		return {
			x: Math.round(dx / gs) * gs,
			y: Math.round(dy / gs) * gs
		};
	}
}

interface MoveComponentValue {
	x: number;
	y: number;
}

@Component({
	selector: 'se-move',
	templateUrl: './move.component.html',
	styleUrls: ['./move.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoveComponent {

	readonly formGroup: FormGroup;

	get canMove(): boolean {
		return this.formGroup.valid;
	}

	private get value(): MoveComponentValue {
		return this.formGroup.value;
	}

	constructor(private readonly viewService: ViewService, formBuilder: FormBuilder) {
		this.formGroup = formBuilder.group({});
		this.formGroup.addControl('x', formBuilder.control(0, [Validators.required]));
		this.formGroup.addControl('y', formBuilder.control(0, [Validators.required]));
	}

	move() {
		const value = this.value;
		this.viewService.translateSelected(value.x, value.y);
	}
}
