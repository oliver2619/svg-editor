import { AbstractDrawTool } from './tool';
import { GroupBuilder } from '../model/svg-builder/group-builder';
import { LineBuilder } from '../model/svg-builder/line-builder';
import { ShapePropertiesComponent } from '../shape-properties/shape-properties.component';
import { ViewService } from '../view/view.service';
import { ViewContainerRef, ComponentRef } from '@angular/core';

export class LineTool extends AbstractDrawTool {

	private readonly group: GroupBuilder;
	private line: LineBuilder | undefined;
	private propertiesComponent: ShapePropertiesComponent | undefined;

	constructor(viewService: ViewService) {
		super(viewService);
		this.group = viewService.toolGroupBuilder;
	}

	cleanUp() {
		if (this.line !== undefined) {
			this.group.clearShapes();
			this.line = undefined;
		}
	}

	createPropertiesComponent(container: ViewContainerRef): ComponentRef<any> | undefined {
		const ret = container.createComponent(ShapePropertiesComponent);
		ret.setInput('fill', false);
		ret.setInput('global', true);
		ret.setInput('line-cap', true);
		ret.setInput('line-join', false);
		this.propertiesComponent = ret.instance;
		return ret;
	}

	protected onComplete(startX: number, startY: number, targetX: number, targetY: number): void {
		this.cleanUp();
		if (this.propertiesComponent !== undefined) {
			this.viewService.addLine({
				...this.propertiesComponent.shapeProperties,
				x1: startX,
				y1: startY,
				x2: targetX,
				y2: targetY,
				stroke: this.propertiesComponent.strokeProperties,
				lineCap: this.propertiesComponent.lineCap
			});
		}
	}

	protected onDraw(startX: number, startY: number, targetX: number, targetY: number): void {
		if (this.line !== undefined) {
			this.line.setLine(startX, startY, targetX, targetY);
		}
	}

	protected onStart(x: number, y: number): void {
		this.line = this.group.line(x, y, x, y);
		this.line.setStrokeColor('black');
	}
}

