import { ChangeDetectionStrategy, Component, ViewContainerRef, ComponentRef, ViewChild } from '@angular/core';
import { AbstractDrawTool } from '../tool';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ViewService } from 'src/app/view/view.service';
import { ShapePropertiesComponent } from 'src/app/shape-properties/shape-properties.component';
import { Coordinate } from 'src/app/model/coordinate';
import { GroupBuilder } from 'src/app/model/svg-builder/group-builder';
import { PolygonBuilder } from 'src/app/model/svg-builder/polygon-builder';
import { FillProperties, ShapeProperties, StrokeProperties } from 'src/app/model/properties/model-element-properties';
import { LineJoin } from 'src/app/model/line-properties';
import { PathPropertiesBuilder } from 'src/app/model/properties/path-properties-builder';

export class PolygonTool extends AbstractDrawTool {

	private readonly group: GroupBuilder;
	private polygon: PolygonBuilder | undefined;
	private polygonComponent: PolygonComponent | undefined;

	constructor(viewService: ViewService) {
		super(viewService);
		this.group = viewService.toolGroupBuilder;
	}

	cleanUp() {
		if (this.polygon !== undefined) {
			this.group.clearShapes();
			this.polygon = undefined;
		}
	}

	createPropertiesComponent(container: ViewContainerRef): ComponentRef<any> | undefined {
		const ret = container.createComponent(PolygonComponent);
		this.polygonComponent = ret.instance;
		return ret;
	}

	protected onComplete(startX: number, startY: number, targetX: number, targetY: number): void {
		this.cleanUp();
		if (this.polygonComponent !== undefined && this.polygonComponent.shapePropertiesComponent !== undefined) {
			const points = this.createPoints(startX, startY, targetX, targetY, this.polygonComponent.value);
			const builder = new PathPropertiesBuilder();
			points.forEach((p, i) => {
				if (i === 0) {
					builder.moveTo(p.x, p.y);
				} else {
					builder.lineTo(p.x, p.y);
				}
			});
			this.viewService.addPath({
				...this.polygonComponent.shapeProperties,
				fill: this.polygonComponent.fillProperties,
				stroke: this.polygonComponent.strokeProperties,
				lineJoin: this.polygonComponent.lineJoin,
				commands: builder.close().getCommands()
			});
		}
	}

	protected onDraw(startX: number, startY: number, targetX: number, targetY: number): void {
		if (this.polygon !== undefined && this.polygonComponent !== undefined) {
			this.polygon.clearPoints();
			this.createPoints(startX, startY, targetX, targetY, this.polygonComponent.value).forEach(c => (<PolygonBuilder>this.polygon).addPoint(c.x, c.y));
		}
	}

	protected onStart(x: number, y: number): void {
		this.polygon = this.group.polygon();
		if (this.polygonComponent !== undefined) {
			this.polygon.setShapeProperties(this.polygonComponent.shapeProperties);
			this.polygon.setFillProperties(this.polygonComponent.fillProperties);
			this.polygon.setStrokeProperties(this.polygonComponent.strokeProperties);
			this.polygon.setLineJoin(this.polygonComponent.lineJoin);
		}
	}

	private createPoints(startX: number, startY: number, targetX: number, targetY: number, properties: PolygonComponentValue): Coordinate[] {
		const ret: Coordinate[] = [];
		const x = (startX + targetX) / 2;
		const y = (startY + targetY) / 2;
		const rx = Math.abs(targetX - startX) / 2;
		const ry = Math.abs(targetY - startY) / 2;
		let angle = properties.angle * Math.PI / 180;
		for (let i = 0; i < properties.vertices; ++i) {
			ret.push(new Coordinate(x + rx * Math.sin(angle), y - ry * Math.cos(angle)));
			angle += properties.step * Math.PI * 2 / properties.vertices;
		}
		return ret;
	}
}

interface PolygonComponentValue {
	angle: number;
	vertices: number;
	step: number;
}

@Component({
	selector: 'se-polygon',
	templateUrl: './polygon.component.html',
	styleUrls: ['./polygon.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PolygonComponent {

	@ViewChild('shapeProperties')
	shapePropertiesComponent: ShapePropertiesComponent | undefined;

	readonly formGroup: FormGroup;

	get fillProperties(): FillProperties { return this.shapePropertiesComponent!.fillProperties; }

	get strokeProperties(): StrokeProperties { return this.shapePropertiesComponent!.strokeProperties; }

	get shapeProperties(): ShapeProperties { return this.shapePropertiesComponent!.shapeProperties; }

	get lineJoin(): LineJoin { return this.shapePropertiesComponent!.lineJoin; }

	get value(): PolygonComponentValue {
		return this.formGroup.value;
	}

	constructor(formBuilder: FormBuilder) {
		this.formGroup = formBuilder.group({});
		this.formGroup.addControl('vertices', formBuilder.control(3, [Validators.required, Validators.min(3)]));
		this.formGroup.addControl('step', formBuilder.control(1, [Validators.required, Validators.min(1)]));
		this.formGroup.addControl('angle', formBuilder.control(0, [Validators.required]));
	}
}
