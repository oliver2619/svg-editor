import { FillModelImp } from './fill-model-imp';
import { StrokeModelImp } from './stroke-model-imp';
import { LineJoin } from '../line-properties';
import { ShapeContainerBuilder } from '../svg-builder/shape-container-builder';
import { RectProperties } from '../model-element-properties';
import { ShapeModelType } from '../shape-model';
import { BoxShapeModelImp } from './box-shape-model-imp';

export class RectModelImp extends BoxShapeModelImp {

	readonly type = ShapeModelType.RECT;

	private rx: number;
	private ry: number;
	private fill: FillModelImp;
	private stroke: StrokeModelImp;
	private lineJoin: LineJoin;

	constructor(id: string, parentId: string | undefined, properties: RectProperties) {
		super(id, parentId, properties);
		this.rx = properties.rx;
		this.ry = properties.ry;
		this.fill = new FillModelImp(properties.fill);
		this.stroke = new StrokeModelImp(properties.stroke);
		this.lineJoin = properties.lineJoin;
	}

	buildSvg(builder: ShapeContainerBuilder): void {
		const rect = builder.rect(this.x, this.y, this.width, this.height);
		rect.setRadius(this.rx, this.ry);
		rect.setRotation(this.rotation, this.x, this.y);
		this.buildShapeAttributes(rect);
		this.fill.buildAttributes(rect);
		this.stroke.buildAttributes(rect);
		rect.setLineJoin(this.lineJoin);
	}

	override getMnemento(): RectProperties {
		return {
			...super.getMnemento(),
			rx: this.rx,
			ry: this.ry,
			fill: this.fill.getMnemento(),
			stroke: this.stroke.getMnemento(),
			lineJoin: this.lineJoin
		};
	}

	override scale(sx: number, sy: number, px: number, py: number): void {
		super.scale(sx, sy, px, py);
		const f = Math.sqrt(Math.abs(sx * sy));
		this.rx *= f;
		this.ry *= f;
	}

	override setMnemento(m: RectProperties) {
		super.setMnemento(m);
		this.rx = m.rx;
		this.ry = m.ry;
		this.fill = new FillModelImp(m.fill);
		this.stroke = new StrokeModelImp(m.stroke);
		this.lineJoin = m.lineJoin;
	}
}
