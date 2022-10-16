import { ShapeModelImp } from './shape-model-imp';
import { StrokeModelImp } from './stroke-model-imp';
import { LineCap } from '../line-properties';
import { ShapeContainerBuilder } from '../svg-builder/shape-container-builder';
import { LineProperties, ShapeProperties, StrokeProperties } from '../properties/model-element-properties';
import { ShapeModelType } from '../shape-model';
import { Coordinate } from '../coordinate';
import { PathProperties } from '../properties/path-properties';
import { PathPropertiesBuilder } from '../properties/path-properties-builder';
import { NoColor } from '../color/no-color';
import { ComponentRef, ViewContainerRef } from '@angular/core';
import { ShapePropertiesComponent } from 'src/app/shape-properties/shape-properties.component';
import { MutableSvgModel } from '../svg-model';

export class LineModelImp extends ShapeModelImp {

	readonly canConvertToPath = true;
	readonly type = ShapeModelType.LINE;

	private x1: number;
	private y1: number;
	private x2: number;
	private y2: number;
	private stroke: StrokeModelImp;

	constructor(id: string, parentId: string | undefined, properties: LineProperties) {
		super(id, parentId, properties);
		this.x1 = properties.x1;
		this.y1 = properties.y1;
		this.x2 = properties.x2;
		this.y2 = properties.y2;
		this.stroke = new StrokeModelImp(properties.stroke);
	}

	buildSvg(builder: ShapeContainerBuilder): void {
		const line = builder.line(this.x1, this.y1, this.x2, this.y2);
		this.buildShapeAttributes(line);
		this.stroke.buildAttributes(line);
	}

	createPropertiesComponent(container: ViewContainerRef, model: MutableSvgModel): ComponentRef<any> {
		const ret = container.createComponent(ShapePropertiesComponent);
		ret.setInput('fill', false);
		ret.setInput('line-join', false);
		ret.instance.strokeProperties = this.stroke.getMnemento();
		ret.instance.shapeProperties = this.getMnemento();
		ret.instance.onStrokeChange.subscribe({
			next: (stroke: StrokeProperties) => {
				const p = this.getMnemento();
				p.stroke = stroke;
				model.setShapeMnemento(this.id, p);
			}
		});
		ret.instance.onShapeChange.subscribe({
			next: (shape: ShapeProperties) => {
				const p = { ...this.getMnemento(), ...shape };
				model.setShapeMnemento(this.id, p);
			}
		});
		return ret;
	}

	flipH(px: number): void {
		const p1 = new Coordinate(this.x1, this.y1);
		const p2 = new Coordinate(this.x2, this.y2);
		p1.flipH(px);
		p2.flipH(px);
		this.x1 = p1.x;
		this.y1 = p1.y;
		this.x2 = p2.x;
		this.y2 = p2.y;
	}

	flipV(py: number): void {
		const p1 = new Coordinate(this.x1, this.y1);
		const p2 = new Coordinate(this.x2, this.y2);
		p1.flipV(py);
		p2.flipV(py);
		this.x1 = p1.x;
		this.y1 = p1.y;
		this.x2 = p2.x;
		this.y2 = p2.y;
	}

	getConvertToPathProperties(): PathProperties {
		const commands = new PathPropertiesBuilder().moveTo(this.x1, this.y1).lineTo(this.x2, this.y2).getCommands();
		const ret: PathProperties = {
			...super.getMnemento(),
			fill: { color: NoColor.INSTANCE },
			stroke: this.stroke.getMnemento(),
			lineJoin: 'arcs',
			commands
		};
		return ret;
	}

	override getMnemento(): LineProperties {
		return {
			...super.getMnemento(),
			x1: this.x1,
			y1: this.y1,
			x2: this.x2,
			y2: this.y2,
			stroke: this.stroke.getMnemento()
		};
	}

	rotate(deg: number, px: number, py: number) {
		const p1 = new Coordinate(this.x1, this.y1);
		const p2 = new Coordinate(this.x2, this.y2);
		p1.rotate(deg, px, py);
		p2.rotate(deg, px, py);
		this.x1 = p1.x;
		this.y1 = p1.y;
		this.x2 = p2.x;
		this.y2 = p2.y;
	}

	scale(sx: number, sy: number, px: number, py: number): void {
		const p1 = new Coordinate(this.x1, this.y1);
		const p2 = new Coordinate(this.x2, this.y2);
		p1.scale(sx, sy, px, py);
		p2.scale(sx, sy, px, py);
		this.x1 = p1.x;
		this.y1 = p1.y;
		this.x2 = p2.x;
		this.y2 = p2.y;
	}

	override setMnemento(m: LineProperties) {
		super.setMnemento(m);
		this.x1 = m.x1;
		this.y1 = m.y1;
		this.x2 = m.x2;
		this.y2 = m.y2;
		this.stroke = new StrokeModelImp(m.stroke);
	}

	translate(dx: number, dy: number) {
		this.x1 += dx;
		this.y1 += dy;
		this.x2 += dx;
		this.y2 += dy;
	}
}
