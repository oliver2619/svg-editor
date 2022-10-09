import { ShapeModelImp } from './shape-model-imp';
import { ShapeModelType } from '../shape-model';
import { FillModelImp } from './fill-model-imp';
import { StrokeModelImp } from './stroke-model-imp';
import { CircleProperties } from '../model-element-properties';
import { ShapeContainerBuilder } from '../svg-builder/shape-container-builder';

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

