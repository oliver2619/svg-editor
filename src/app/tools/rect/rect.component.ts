import { ChangeDetectionStrategy, Component, ViewContainerRef, ComponentRef, ViewChild } from '@angular/core';
import { ViewService } from 'src/app/view/view.service';
import { AbstractDrawTool } from '../tool';
import { ShapePropertiesComponent } from 'src/app/shape-properties/shape-properties.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GroupBuilder } from 'src/app/model/svg-builder/group-builder';
import { RectBuilder } from 'src/app/model/svg-builder/rect-builder';

export class RectTool extends AbstractDrawTool {

	private readonly group: GroupBuilder;
	private rect: RectBuilder | undefined;
	private propertiesComponent: RectComponent | undefined;

	constructor(viewService: ViewService) {
		super(viewService);
		this.group = viewService.toolGroupBuilder;
	}

	cleanUp() {
		if (this.rect !== undefined) {
			this.group.clearShapes();
			this.rect = undefined;
		}
	}

	createPropertiesComponent(container: ViewContainerRef): ComponentRef<any> | undefined {
		const ret = container.createComponent(RectComponent);
		this.propertiesComponent = ret.instance;
		return ret;
	}

	protected onComplete(startX: number, startY: number, targetX: number, targetY: number): void {
		this.cleanUp();
		if (this.propertiesComponent !== undefined && this.propertiesComponent.shapePropertiesComponent !== undefined) {
			this.viewService.addRect({
				...this.propertiesComponent.shapePropertiesComponent.shapeProperties,
				x: Math.min(startX, targetX),
				y: Math.min(startY, targetY),
				width: Math.abs(targetX - startX),
				height: Math.abs(targetY - startY),
				rx: this.propertiesComponent.rx,
				ry: this.propertiesComponent.ry,
				rotation: 0,
				fill: this.propertiesComponent.shapePropertiesComponent.fillProperties,
				stroke: this.propertiesComponent.shapePropertiesComponent.strokeProperties,
				lineJoin: this.propertiesComponent.shapePropertiesComponent.lineJoin
			});
		}
	}

	protected onDraw(startX: number, startY: number, targetX: number, targetY: number): void {
		if (this.rect !== undefined) {
			this.rect.setRect(Math.min(startX, targetX), Math.min(startY, targetY), Math.abs(targetX - startX), Math.abs(targetY - startY));
		}
	}

	protected onStart(x: number, y: number): void {
		this.rect = this.group.rect(x, y, 0, 0);
		this.rect.setStrokeColor('black');
		this.rect.setFillColor('none');
	}
}

interface RectComponentValue {
	rx: number;
	ry: number;
}

@Component({
	selector: 'se-rect',
	templateUrl: './rect.component.html',
	styleUrls: ['./rect.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class RectComponent {

	@ViewChild('shapeProperties')
	shapePropertiesComponent: ShapePropertiesComponent | undefined;

	readonly formGroup: FormGroup;

	get rx(): number {
		return this.value.rx;
	}

	get ry(): number {
		return this.value.ry;
	}

	private get value(): RectComponentValue {
		return this.formGroup.value;
	}

	constructor(formBuilder: FormBuilder) {
		this.formGroup = formBuilder.group({});
		this.formGroup.addControl('rx', formBuilder.control(0, [Validators.required, Validators.min(0)]))
		this.formGroup.addControl('ry', formBuilder.control(0, [Validators.required, Validators.min(0)]))
	}

}
