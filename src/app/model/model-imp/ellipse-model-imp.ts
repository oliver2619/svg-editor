import { ShapeModelImp } from './shape-model-imp';
import { FillModelImp } from './fill-model-imp';
import { StrokeModelImp } from './stroke-model-imp';
import { ShapeContainerBuilder } from '../svg-builder/shape-container-builder';
import { EllipseProperties, FillProperties, ShapeProperties, StrokeProperties } from '../properties/model-element-properties';
import { ShapeModelType } from '../shape-model';
import { Coordinate } from '../coordinate';
import { PathProperties } from '../properties/path-properties';
import { PathPropertiesBuilder } from '../properties/path-properties-builder';
import { ComponentRef, ViewContainerRef } from '@angular/core';
import { ShapePropertiesComponent } from 'src/app/shape-properties/shape-properties.component';
import { MutableSvgModel } from '../svg-model';

export class EllipseModelImp extends ShapeModelImp {

	readonly canConvertToPath = true;
	readonly type = ShapeModelType.ELLIPSE;

	private cx: number;
	private cy: number;
	private rx: number;
	private ry: number;
	private fill: FillModelImp;
	private stroke: StrokeModelImp;
	private rotation: number;

	constructor(id: string, parentId: string | undefined, properties: EllipseProperties) {
		super(id, parentId, properties);
		this.cx = properties.cx;
		this.cy = properties.cy;
		this.rx = properties.rx;
		this.ry = properties.ry;
		this.rotation = properties.rotation;
		this.fill = new FillModelImp(properties.fill);
		this.stroke = new StrokeModelImp(properties.stroke);
	}

	buildSvg(builder: ShapeContainerBuilder): void {
		const ellipse = builder.ellipse(this.cx, this.cy, this.rx, this.ry);
		ellipse.setRotation(this.rotation, this.cx, this.cy);
		this.buildShapeAttributes(ellipse);
		this.fill.buildAttributes(ellipse);
		this.stroke.buildAttributes(ellipse);
	}

	createPropertiesComponent(container: ViewContainerRef, model: MutableSvgModel): ComponentRef<any> {
		const ret = container.createComponent(ShapePropertiesComponent);
		ret.setInput('fill', true);
		ret.setInput('line-join', false);
		ret.instance.fillProperties = this.fill.getMnemento();
		ret.instance.strokeProperties = this.stroke.getMnemento();
		ret.instance.shapeProperties = this.getMnemento();
		ret.instance.onFillChange.subscribe({
			next: (fill: FillProperties) => {
				const p = this.getMnemento();
				p.fill = fill;
				model.setShapeMnemento(this.id, p);
			}
		});
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
		const c = new Coordinate(this.cx, this.cy);
		c.flipH(px);
		this.cx = c.x;
		this.cy = c.y;
		this.rotation = -this.rotation;
	}

	flipV(py: number): void {
		const c = new Coordinate(this.cx, this.cy);
		c.flipV(py);
		this.cx = c.x;
		this.cy = c.y;
		this.rotation = -this.rotation;
	}

	getConvertToPathProperties(): PathProperties {
		const a = this.rotation * Math.PI / 180;
		const cs = Math.cos(a);
		const sn = Math.sin(a);
		const ux = this.rx * cs;
		const uy = this.rx * sn;
		const vy = this.ry * cs;
		const vx = -this.ry * sn;
		const commands = new PathPropertiesBuilder()
			.moveTo(this.cx + ux, this.cy + uy)
			.quadraticCurveTo(this.cx + ux - vx, this.cy + uy - vy, this.cx - vx, this.cy - vy)
			.continueQuadraticCurveTo(this.cx - ux, this.cy - uy)
			.continueQuadraticCurveTo(this.cx + vx, this.cy + vy)
			.continueQuadraticCurveTo(this.cx + ux, this.cy + uy)
			.close()
			.getCommands();
		const ret: PathProperties = {
			...super.getMnemento(),
			fill: this.fill.getMnemento(),
			stroke: this.stroke.getMnemento(),
			lineJoin: 'arcs',
			commands
		};
		return ret;
	}

	override getMnemento(): EllipseProperties {
		return {
			...super.getMnemento(),
			cx: this.cx,
			cy: this.cy,
			rx: this.rx,
			ry: this.ry,
			fill: this.fill.getMnemento(),
			stroke: this.stroke.getMnemento(),
			rotation: this.rotation
		};
	}

	rotate(deg: number, px: number, py: number) {
		const c = new Coordinate(this.cx, this.cy);
		c.rotate(deg, px, py);
		this.cx = c.x;
		this.cy = c.y;
		this.rotation += deg;
	}

	scale(sx: number, sy: number, px: number, py: number): void {
		const c = new Coordinate(this.cx, this.cy);
		c.scale(sx, sy, px, py);
		this.cx = c.x;
		this.cy = c.y;
		const f = Math.sqrt(Math.abs(sx * sy));
		this.rx *= f;
		this.ry *= f;
	}

	override setMnemento(m: EllipseProperties) {
		super.setMnemento(m);
		this.cx = m.cx;
		this.cy = m.cy;
		this.rx = m.rx;
		this.ry = m.ry;
		this.fill = new FillModelImp(m.fill);
		this.stroke = new StrokeModelImp(m.stroke);
		this.rotation = m.rotation;
	}

	translate(dx: number, dy: number) {
		this.cx += dx;
		this.cy += dy;
	}
}
