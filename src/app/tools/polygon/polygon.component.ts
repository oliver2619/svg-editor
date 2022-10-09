import { ChangeDetectionStrategy, Component, ViewContainerRef, ComponentRef, ViewChild } from '@angular/core';
import { AbstractDrawTool } from '../tool';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ViewService } from 'src/app/view/view.service';
import { ShapePropertiesComponent } from 'src/app/shape-properties/shape-properties.component';
import { Coordinate } from 'src/app/model/coordinate';
import { GroupBuilder } from 'src/app/model/svg-builder/group-builder';
import { PolygonBuilder } from 'src/app/model/svg-builder/polygon-builder';

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
			this.viewService.addPolygon({
				...this.polygonComponent.shapePropertiesComponent.shapeProperties,
				fill: this.polygonComponent.shapePropertiesComponent.fillProperties,
				stroke: this.polygonComponent.shapePropertiesComponent.strokeProperties,
				lineJoin: this.polygonComponent.shapePropertiesComponent.lineJoin,
				points: this.createPoints(startX, startY, targetX, targetY, this.polygonComponent.value)
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
		this.polygon.setStrokeColor('black');
		this.polygon.setFillColor('none');
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
