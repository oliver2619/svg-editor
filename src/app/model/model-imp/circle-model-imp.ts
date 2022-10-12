import { ShapeModelImp } from './shape-model-imp';
import { ShapeModelType } from '../shape-model';
import { FillModelImp } from './fill-model-imp';
import { StrokeModelImp } from './stroke-model-imp';
import { CircleProperties } from '../model-element-properties';
import { ShapeContainerBuilder } from '../svg-builder/shape-container-builder';
import { Coordinate } from '../coordinate';

export class CircleModelImp extends ShapeModelImp {

	readonly type = ShapeModelType.CIRCLE;

	private cx: number;
	private cy: number;
	private r: number;
	private fill: FillModelImp;
	private stroke: StrokeModelImp;

	constructor(id: string, parentId: string | undefined, properties: CircleProperties) {
		super(id, parentId, properties);
		this.cx = properties.cx;
		this.cy = properties.cy;
		this.r = properties.r;
		this.fill = new FillModelImp(properties.fill);
		this.stroke = new StrokeModelImp(properties.stroke);
	}

	buildSvg(builder: ShapeContainerBuilder): void {
		const ellipse = builder.circle(this.cx, this.cy, this.r);
		this.buildShapeAttributes(ellipse);
		this.fill.buildAttributes(ellipse);
		this.stroke.buildAttributes(ellipse);
	}

	flipH(px: number): void {
		const c = new Coordinate(this.cx, this.cy);
		c.flipH(px);
		this.cx = c.x;
		this.cy = c.y;
	}

	flipV(py: number): void {
		const c = new Coordinate(this.cx, this.cy);
		c.flipH(py);
		this.cx = c.x;
		this.cy = c.y;
	}

	override getMnemento(): CircleProperties {
		return {
			...super.getMnemento(),
			cx: this.cx,
			cy: this.cy,
			r: this.r,
			fill: this.fill.getMnemento(),
			stroke: this.stroke.getMnemento()
		};
	}

	rotate(deg: number, px: number, py: number) {
		const c = new Coordinate(this.cx, this.cy);
		c.rotate(deg, px, py);
		this.cx = c.x;
		this.cy = c.y;
	}

	scale(sx: number, sy: number, px: number, py: number): void {
		const c = new Coordinate(this.cx, this.cy);
		c.scale(sx, sy, px, py);
		this.cx = c.x;
		this.cy = c.y;
		this.r *= Math.sqrt(Math.abs(sx * sy));
	}

	override setMnemento(m: CircleProperties) {
		super.setMnemento(m);
		this.cx = m.cx;
		this.cy = m.cy;
		this.r = m.r;
		this.fill = new FillModelImp(m.fill);
		this.stroke = new StrokeModelImp(m.stroke);
	}

	translate(dx: number, dy: number) {
		this.cx += dx;
		this.cy += dy;
	}
}

