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
		return '';
	}

	protected onMouseDown(e: ToolMouseEvent): void {
		this.toolHelper.beginTransform(this.viewService.selectedIds);
	}

	protected onMove(dx: number, dy: number): void {
		this.viewService.setEditModeCurrentTranslation(dx, dy);
	}

	protected onMouseUp(dx: number, dy: number): void {
		this.viewService.setEditModeCurrentTranslation(0, 0);
		this.toolHelper.end();
		this.viewService.translateSelected(dx, dy);
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
