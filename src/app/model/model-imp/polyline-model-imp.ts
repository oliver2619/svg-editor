import { ShapeModelImp } from './shape-model-imp';
import { Coordinate } from '../coordinate';
import { FillModelImp } from './fill-model-imp';
import { StrokeModelImp } from './stroke-model-imp';
import { LineJoin, LineCap } from '../line-properties';
import { ShapeContainerBuilder } from '../svg-builder/shape-container-builder';
import { PolylineProperties } from '../model-element-properties';
import { ShapeModelType } from '../shape-model';

export class PolylineModelImp extends ShapeModelImp {

	readonly type = ShapeModelType.POLYLINE;

	private points: Coordinate[];
	private fill: FillModelImp;
	private stroke: StrokeModelImp;
	private lineJoin: LineJoin;
	private lineCap: LineCap;

	constructor(id: string, parentId: string | undefined, properties: PolylineProperties) {
		super(id, parentId, properties);
		this.fill = new FillModelImp(properties.fill);
		this.stroke = new StrokeModelImp(properties.stroke);
		this.lineCap = properties.lineCap;
		this.lineJoin = properties.lineJoin;
		this.points = properties.points.map(c => c.clone());
	}

	buildSvg(builder: ShapeContainerBuilder): void {
		const polyline = builder.polyline();
		this.buildShapeAttributes(polyline);
		this.fill.buildAttributes(polyline);
		this.stroke.buildAttributes(polyline);
		polyline.setLineCap(this.lineCap);
		polyline.setLineJoin(this.lineJoin);
		this.points.forEach(p => polyline.addPoint(p.x, p.y));
	}

	override getMnemento(): PolylineProperties {
		return {
			...super.getMnemento(),
			points: this.points.map(c => c.clone()),
			fill: this.fill.getMnemento(),
			stroke: this.stroke.getMnemento(),
			lineJoin: this.lineJoin,
			lineCap: this.lineCap
		};
	}

	override setMnemento(m: PolylineProperties) {
		super.setMnemento(m);
		this.fill = new FillModelImp(m.fill);
		this.stroke = new StrokeModelImp(m.stroke);
		this.lineCap = m.lineCap;
		this.lineJoin = m.lineJoin;
		this.points = m.points.map(c => c.clone());
	}

	translate(dx: number, dy: number) {
		this.points.forEach(p => p.translate(dx, dy));
	}
}
