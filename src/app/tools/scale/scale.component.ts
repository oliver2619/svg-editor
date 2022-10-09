import { ChangeDetectionStrategy, Component, ViewContainerRef, ComponentRef } from '@angular/core';
import { AbstractMoveTool } from '../tool';
import { ToolMouseEvent } from '../tool-mouse-event';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TextService } from 'src/app/shared/text/text.service';

export class ScaleTool extends AbstractMoveTool {

	constructor() {
		super(true);
	}

	cleanUp() {}
	
	createPropertiesComponent(container: ViewContainerRef): ComponentRef<any> | undefined {
		return container.createComponent(ScaleComponent);
	}

	getHint(textService: TextService): string {
		return '';
	}

	protected onMouseDown(e: ToolMouseEvent): void {
	}

	protected onMove(dx: number, dy: number, snapToDiscreteValues: boolean): void {
	}

	protected onMouseUp(dx: number, dy: number, snapToDiscreteValues: boolean): void {
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
export class ScaleComponent  {

	readonly formGroup: FormGroup;

	get canScale(): boolean {
		return this.formGroup.valid;
	}

	constructor(formBuilder: FormBuilder) {
		this.formGroup = formBuilder.group({});
		this.formGroup.addControl('x', formBuilder.control(100, [Validators.required]));
		this.formGroup.addControl('y', formBuilder.control(100, [Validators.required]));
	}

	scale() {
		const value: ScaleComponentValue = this.formGroup.value;
		console.log(value);
	}
}
