import { ShapeModelImp } from './shape-model-imp';
import { FillModelImp } from './fill-model-imp';
import { StrokeModelImp } from './stroke-model-imp';
import { ShapeContainerBuilder } from '../svg-builder/shape-container-builder';
import { EllipseProperties } from '../model-element-properties';
import { ShapeModelType } from '../shape-model';

export class EllipseModelImp extends ShapeModelImp {

	readonly type = ShapeModelType.ELLIPSE;

	private cx: number;
	private cy: number;
	private rx: number;
	private ry: number;
	private fill: FillModelImp;
	private stroke: StrokeModelImp;

	constructor(id: string, parentId: string | undefined, properties: EllipseProperties) {
		super(id, parentId, properties);
		this.cx = properties.cx;
		this.cy = properties.cy;
		this.rx = properties.rx;
		this.ry = properties.ry;
		this.fill = new FillModelImp(properties.fill);
		this.stroke = new StrokeModelImp(properties.stroke);
	}

	buildSvg(builder: ShapeContainerBuilder): void {
		const ellipse = builder.ellipse(this.cx, this.cy, this.rx, this.ry);
		this.buildShapeAttributes(ellipse);
		this.fill.buildAttributes(ellipse);
		this.stroke.buildAttributes(ellipse);
	}

	override getMnemento(): EllipseProperties {
		return {
			...super.getMnemento(),
			cx: this.cx,
			cy: this.cy,
			rx: this.rx,
			ry: this.ry,
			fill: this.fill.getMnemento(),
			stroke: this.stroke.getMnemento()
		};
	}

	override setMnemento(m: EllipseProperties) {
		super.setMnemento(m);
		this.cx = m.cx;
		this.cy = m.cy;
		this.rx = m.rx;
		this.ry = m.ry;
		this.fill = new FillModelImp(m.fill);
		this.stroke = new StrokeModelImp(m.stroke);
	}

	translate(dx: number, dy: number) {
		this.cx += dx;
		this.cy += dy;
	}
}
