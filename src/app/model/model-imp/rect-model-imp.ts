import { ShapeModelImp } from './shape-model-imp';
import { FillModelImp } from './fill-model-imp';
import { StrokeModelImp } from './stroke-model-imp';
import { LineJoin } from '../line-properties';
import { ShapeContainerBuilder } from '../svg-builder/shape-container-builder';
import { RectProperties } from '../model-element-properties';
import { ShapeModelType } from '../shape-model';

export class RectModelImp extends ShapeModelImp {

	readonly type = ShapeModelType.RECT;

	private x: number;
	private y: number;
	private width: number;
	private height: number;
	private rx: number;
	private ry: number;
	private fill: FillModelImp;
	private stroke: StrokeModelImp;
	private lineJoin: LineJoin;

	constructor(id: string, parentId: string | undefined, properties: RectProperties) {
		super(id, parentId, properties);
		this.x = properties.x;
		this.y = properties.y;
		this.width = properties.width;
		this.height = properties.height;
		this.rx = properties.rx;
		this.ry = properties.ry;
		this.fill = new FillModelImp(properties.fill);
		this.stroke = new StrokeModelImp(properties.stroke);
		this.lineJoin = properties.lineJoin;
	}

	buildSvg(builder: ShapeContainerBuilder): void {
		const rect = builder.rect(this.x, this.y, this.width, this.height);
		rect.setRadius(this.rx, this.ry);
		this.buildShapeAttributes(rect);
		this.fill.buildAttributes(rect);
		this.stroke.buildAttributes(rect);
		rect.setLineJoin(this.lineJoin);
	}

	override getMnemento(): RectProperties {
		return {
			...super.getMnemento(),
			x: this.x,
			y: this.y,
			width: this.width,
			height: this.height,
			rx: this.rx,
			ry: this.ry,
			fill: this.fill.getMnemento(),
			stroke: this.stroke.getMnemento(),
			lineJoin: this.lineJoin
		};
	}

	override setMnemento(m: RectProperties) {
		super.setMnemento(m);
		this.x = m.x;
		this.y = m.y;
		this.width = m.width;
		this.height = m.height;
		this.rx = m.rx;
		this.ry = m.ry;
		this.fill = new FillModelImp(m.fill);
		this.stroke = new StrokeModelImp(m.stroke);
		this.lineJoin = m.lineJoin;

	}

	translate(dx: number, dy: number) {
		this.x += dx;
		this.y += dy;
	}
}
