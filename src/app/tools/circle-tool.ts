import { AbstractDrawTool } from './tool';
import { GroupBuilder } from '../model/svg-builder/group-builder';
import { ShapePropertiesComponent } from '../shape-properties/shape-properties.component';
import { ViewService } from '../view/view.service';
import { ViewContainerRef, ComponentRef } from '@angular/core';
import { CircleBuilder } from '../model/svg-builder/circle-builder';

export class CircleTool extends AbstractDrawTool {

	private readonly group: GroupBuilder;
	private circle: CircleBuilder | undefined;
	private propertiesComponent: ShapePropertiesComponent | undefined;

	constructor(viewService: ViewService) {
		super(viewService);
		this.group = viewService.toolGroupBuilder;
	}

	cleanUp(): void {
		if (this.circle !== undefined) {
			this.group.clearShapes();
			this.circle = undefined;
		}
	}

	createPropertiesComponent(container: ViewContainerRef): ComponentRef<any> | undefined {
		const ret = container.createComponent(ShapePropertiesComponent);
		ret.setInput('global', true);
		ret.setInput('line-cap', false);
		ret.setInput('line-join', false);
		this.propertiesComponent = ret.instance;
		return ret;
	}

	protected onComplete(startX: number, startY: number, targetX: number, targetY: number): void {
		this.cleanUp();
		if (this.propertiesComponent !== undefined) {
			this.viewService.addCircle({
				...this.propertiesComponent.shapeProperties,
				cx: (startX + targetX) * .5,
				cy: (startY + targetY) * .5,
				r: Math.abs(targetX - startX) * .5,
				fill: this.propertiesComponent.fillProperties,
				stroke: this.propertiesComponent.strokeProperties
			});
		}
	}

	protected onDraw(startX: number, startY: number, targetX: number, targetY: number): void {
		if (this.circle !== undefined) {
			this.circle.setCircle((startX + targetX) * .5, (startY + targetY) * .5, Math.abs(targetX - startX) * .5);
		}
	}

	protected onStart(x: number, y: number): void {
		this.circle = this.group.circle(x, y, 0);
		this.circle.setStrokeColor('black');
		this.circle.setFillColor('none');
	}
}
