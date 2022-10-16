import { ChangeDetectionStrategy, Component, ViewContainerRef, ComponentRef, ViewChild } from '@angular/core';
import { Tool } from '../tool';
import { ToolMouseEvent } from '../tool-mouse-event';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TextService } from 'src/app/shared/text/text.service';
import { ViewService } from 'src/app/view/view.service';
import { Coordinate } from 'src/app/model/coordinate';
import { ShapePropertiesComponent } from 'src/app/shape-properties/shape-properties.component';
import { GroupBuilder } from 'src/app/model/svg-builder/group-builder';
import { PolylineBuilder } from 'src/app/model/svg-builder/polyline-builder';
import { ShapePropertiesComponentInterface } from 'src/app/shape-properties/shape-properties-component-interface';
import { FillProperties, ShapeProperties, StrokeProperties } from 'src/app/model/properties/model-element-properties';
import { LineCap, LineJoin } from 'src/app/model/line-properties';
import { PathCmdProperties } from 'src/app/model/properties/path-properties';
import { PathPropertiesBuilder } from 'src/app/model/properties/path-properties-builder';

export class PencilTool implements Tool {

	readonly cursor = 'crosshair';
	readonly selectionPivotVisible = false;
	readonly requiresLocalCoordinates = true;

	private readonly group: GroupBuilder;
	private path: Coordinate[] | undefined;
	private polyline: PolylineBuilder | undefined;
	private propertiesComponent: PencilComponent | undefined;

	constructor(private readonly viewService: ViewService) {
		this.group = viewService.toolGroupBuilder;
	}

	cleanUp() {
		if (this.polyline !== undefined) {
			this.group.clearShapes();
			this.polyline = undefined;
		}
	}

	createPropertiesComponent(container: ViewContainerRef): ComponentRef<any> | undefined {
		const ret = container.createComponent(PencilComponent);
		this.propertiesComponent = ret.instance;
		return ret;
	}

	getHint(textService: TextService): string {
		return '';
	}

	mouseDown(e: ToolMouseEvent): boolean {
		this.polyline = this.group.polyline();
		if (this.propertiesComponent !== undefined) {
			this.polyline.setFillProperties(this.propertiesComponent.fillProperties);
			this.polyline.setStrokeProperties(this.propertiesComponent.strokeProperties);
			this.polyline.setShapeProperties(this.propertiesComponent.shapeProperties);
			this.polyline.setLineJoin(this.propertiesComponent.lineJoin);
		}
		this.path = [];
		this.path.push(new Coordinate(e.x, e.y));
		this.polyline.addPoint(e.x, e.y);
		return true;
	}

	mouseMove(e: ToolMouseEvent): void {
		if (this.path !== undefined) {
			this.path.push(new Coordinate(e.x, e.y));
		}
		if (this.polyline !== undefined) {
			this.polyline.addPoint(e.x, e.y);
		}
	}

	mouseUp(e: ToolMouseEvent): void {
		this.cleanUp();
		if (this.path !== undefined && this.propertiesComponent !== undefined && this.propertiesComponent.shapeProperties !== undefined) {
			const points = this.getReducedPoints(this.path, this.propertiesComponent.value.angleLimit * Math.PI / 180, this.propertiesComponent.value.minSegmentSize);
			const builder = new PathPropertiesBuilder();
			points.forEach((p, i) => {
				if (i === 0) {
					builder.moveTo(p.x, p.y);
				} else {
					builder.lineTo(p.x, p.y);
				}
			});
			this.viewService.addPath({
				...this.propertiesComponent.shapeProperties,
				fill: this.propertiesComponent.fillProperties,
				lineJoin: this.propertiesComponent.lineJoin,
				stroke: this.propertiesComponent.strokeProperties,
				commands: builder.getCommands()
			});
		}
		this.path = undefined;
	}

	mouseHover(e: ToolMouseEvent): void { }

	private getReducedPoints(points: Coordinate[], angleLimit: number, minSegmentSize: number): Coordinate[] {
		const ret = [...points];
		for (let i = 1; i < ret.length - 1; ++i) {
			const dx1 = ret[i - 1].x - ret[i].x;
			const dy1 = ret[i - 1].y - ret[i].y;
			const d1 = dx1 * dx1 + dy1 * dy1;
			if (d1 < minSegmentSize * minSegmentSize) {
				ret.splice(i, 1);
				--i;
			} else {
				const dx2 = ret[i + 1].x - ret[i].x;
				const dy2 = ret[i + 1].y - ret[i].y;
				const a = this.getAngle(dx1, dy1, dx2, dy2);
				if (a <= angleLimit) {
					ret.splice(i, 1);
					--i;
				}
			}
		}
		return ret;
	}

	private getAngle(dx1: number, dy1: number, dx2: number, dy2: number): number {
		const d1 = dx1 * dx1 + dy1 * dy1;
		const d2 = dx2 * dx2 + dy2 * dy2;
		let dot = dx1 * dx2 + dy1 * dy2;
		if (d1 !== 0) {
			dot /= Math.sqrt(d1);
		}
		if (d2 !== 0) {
			dot /= Math.sqrt(d2);
		}
		return Math.PI - Math.acos(dot);
	}
}

interface PencilComponentValue {
	angleLimit: number;
	minSegmentSize: number;
}

@Component({
	selector: 'se-pencil',
	templateUrl: './pencil.component.html',
	styleUrls: ['./pencil.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PencilComponent implements ShapePropertiesComponentInterface {

	@ViewChild('shapeProperties')
	shapePropertiesComponent: ShapePropertiesComponent | undefined;

	readonly formGroup: FormGroup;

	get fillProperties(): FillProperties { return this.shapePropertiesComponent!.fillProperties; }

	get shapeProperties(): ShapeProperties { return this.shapePropertiesComponent!.shapeProperties; }

	get strokeProperties(): StrokeProperties { return this.shapePropertiesComponent!.strokeProperties; }

	get lineJoin(): LineJoin { return this.shapePropertiesComponent!.lineJoin; }

	get value(): PencilComponentValue {
		return this.formGroup.value;
	}

	constructor(formBuilder: FormBuilder) {
		this.formGroup = formBuilder.group({});
		this.formGroup.addControl('angleLimit', formBuilder.control(0, [Validators.required, Validators.min(0), Validators.max(180)]));
		this.formGroup.addControl('minSegmentSize', formBuilder.control(1, [Validators.required, Validators.min(0)]));
	}
}
