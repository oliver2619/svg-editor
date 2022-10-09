import { ShapeModelImp } from './shape-model-imp';
import { Coordinate } from '../coordinate';
import { FillModelImp } from './fill-model-imp';
import { StrokeModelImp } from './stroke-model-imp';
import { LineJoin } from '../line-properties';
import { ShapeContainerBuilder } from '../svg-builder/shape-container-builder';
import { PolygonProperties } from '../model-element-properties';
import { ShapeModelType } from '../shape-model';

export class PolygonModelImp extends ShapeModelImp {

	readonly type = ShapeModelType.POLYGON;

	private points: Coordinate[];
	private fill: FillModelImp;
	private stroke: StrokeModelImp;
	private lineJoin: LineJoin;

	constructor(id: string, parentId: string | undefined, properties: PolygonProperties) {
		super(id, parentId, properties);
		this.points = properties.points.map(c => c.clone());
		this.fill = new FillModelImp(properties.fill);
		this.stroke = new StrokeModelImp(properties.stroke);
		this.lineJoin = properties.lineJoin;
	}

	buildSvg(builder: ShapeContainerBuilder): void {
		const polygon = builder.polygon();
		this.buildShapeAttributes(polygon);
		this.points.forEach(p => polygon.addPoint(p.x, p.y));
		this.fill.buildAttributes(polygon);
		this.stroke.buildAttributes(polygon);
		polygon.setLineJoin(this.lineJoin);
	}

	override getMnemento(): PolygonProperties {
		return {
			...super.getMnemento(),
			points: this.points.map(c => c.clone()),
			fill: this.fill.getMnemento(),
			stroke: this.stroke.getMnemento(),
			lineJoin: this.lineJoin
		};
	}

	override setMnemento(m: PolygonProperties) {
		super.setMnemento(m);
		this.points = m.points.map(c => c.clone());
		this.fill = new FillModelImp(m.fill);
		this.stroke = new StrokeModelImp(m.stroke);
		this.lineJoin = m.lineJoin;
	}

	translate(dx: number, dy: number) {
		this.points.forEach(p => p.translate(dx, dy));
	}
}
