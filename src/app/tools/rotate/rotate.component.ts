import { ChangeDetectionStrategy, Component, ComponentRef, ViewContainerRef } from '@angular/core';
import { ToolMouseEvent } from '../tool-mouse-event';
import { AbstractMoveTool } from '../tool';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TextService } from 'src/app/shared/text/text.service';

export class RotateTool extends AbstractMoveTool {

	constructor() {
		super(true);
	}

	cleanUp() { }

	createPropertiesComponent(container: ViewContainerRef): ComponentRef<any> | undefined {
		return container.createComponent(RotateComponent);
	}

	getHint(textService: TextService): string {
		return '';
	}

	protected onMouseDown(e: ToolMouseEvent): void {
	}

	protected onMove(dx: number, dy: number): void {
	}

	protected onMouseUp(dx: number, dy: number): void {
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

	constructor(formBuilder: FormBuilder) {
		this.formGroup = formBuilder.group({});
		this.formGroup.addControl('angle', formBuilder.control(0, [Validators.required]));
	}

	rotate() {
		const value: RotateComponentValue = this.formGroup.value;
		console.log(value);
	}
}
