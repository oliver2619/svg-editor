import { AbstractDrawTool } from './tool';
import { GroupBuilder } from '../model/svg-builder/group-builder';
import { EllipseBuilder } from '../model/svg-builder/ellipse-builder';
import { ShapePropertiesComponent } from '../shape-properties/shape-properties.component';
import { ViewService } from '../view/view.service';
import { ViewContainerRef, ComponentRef } from '@angular/core';
import { ShapePropertiesComponentInterface } from '../shape-properties/shape-properties-component-interface';

export class EllipseTool extends AbstractDrawTool {

	private readonly group: GroupBuilder;
	private ellipse: EllipseBuilder | undefined;
	private propertiesComponent: ShapePropertiesComponentInterface | undefined;

	constructor(viewService: ViewService) {
		super(viewService);
		this.group = viewService.toolGroupBuilder;
	}

	cleanUp(): void {
		if (this.ellipse !== undefined) {
			this.group.clearShapes();
			this.ellipse = undefined;
		}
	}

	createPropertiesComponent(container: ViewContainerRef): ComponentRef<any> | undefined {
		const ret = container.createComponent(ShapePropertiesComponent);
		ret.setInput('global', true);
		ret.setInput('line-join', false);
		this.propertiesComponent = ret.instance;
		return ret;
	}

	protected onComplete(startX: number, startY: number, targetX: number, targetY: number): void {
		this.cleanUp();
		if (this.propertiesComponent !== undefined) {
			this.viewService.addEllipse({
				...this.propertiesComponent.shapeProperties,
				cx: (startX + targetX) * .5,
				cy: (startY + targetY) * .5,
				rx: Math.abs(targetX - startX) * .5,
				ry: Math.abs(targetY - startY) * .5,
				rotation: 0,
				fill: this.propertiesComponent.fillProperties,
				stroke: this.propertiesComponent.strokeProperties
			});
		}
	}

	protected onDraw(startX: number, startY: number, targetX: number, targetY: number): void {
		if (this.ellipse !== undefined) {
			this.ellipse.setEllipse((startX + targetX) * .5, (startY + targetY) * .5, Math.abs(targetX - startX) * .5, Math.abs(targetY - startY) * .5);
		}
	}

	protected onStart(x: number, y: number): void {
		this.ellipse = this.group.ellipse(x, y, 0, 0);
		if (this.propertiesComponent !== undefined) {
			this.ellipse.setFillProperties(this.propertiesComponent.fillProperties);
			this.ellipse.setStrokeProperties(this.propertiesComponent.strokeProperties);
			this.ellipse.setShapeProperties(this.propertiesComponent.shapeProperties);
		}
	}
}
