import { ShapeModelImp } from './shape-model-imp';
import { FillModelImp } from './fill-model-imp';
import { StrokeModelImp } from './stroke-model-imp';
import { LineJoin, LineCap } from '../line-properties';
import { ShapeContainerBuilder } from '../svg-builder/shape-container-builder';
import { PathCmdModelImp } from './path-cmd-model-imp';
import { PathProperties } from '../path-properties';
import { ShapeModelType } from '../shape-model';

export class PathModelImp extends ShapeModelImp {

	readonly type = ShapeModelType.PATH;

	private path: PathCmdModelImp[];
	private fill: FillModelImp;
	private stroke: StrokeModelImp;
	private lineJoin: LineJoin;
	private lineCap: LineCap;

	constructor(id: string, parentId: string | undefined, properties: PathProperties) {
		super(id, parentId, properties);
		this.fill = new FillModelImp(properties.fill);
		this.stroke = new StrokeModelImp(properties.stroke);
		this.lineCap = properties.lineCap;
		this.lineJoin = properties.lineJoin;
		this.path = properties.commands.map(c => PathCmdModelImp.create(c));
	}

	buildSvg(builder: ShapeContainerBuilder): void {
		const path = builder.path();
		this.buildShapeAttributes(path);
		this.fill.buildAttributes(path);
		this.stroke.buildAttributes(path);
		path.setLineCap(this.lineCap);
		path.setLineJoin(this.lineJoin);
		this.path.forEach(p => p.buildPathElement(path.path));
	}

	override getMnemento(): PathProperties {
		return {
			...super.getMnemento(),
			fill: this.fill.getMnemento(),
			stroke: this.stroke.getMnemento(),
			lineJoin: this.lineJoin,
			lineCap: this.lineCap,
			commands: this.path.map(p => p.getMnemento())
		};
	}

	override setMnemento(m: PathProperties) {
		super.setMnemento(m);
		this.fill = new FillModelImp(m.fill);
		this.stroke = new StrokeModelImp(m.stroke);
		this.lineCap = m.lineCap;
		this.lineJoin = m.lineJoin;
		this.path = m.commands.map(c => PathCmdModelImp.create(c));
	}

	translate(dx: number, dy: number) {
		this.path.forEach(p => p.translate(dx, dy));
	}
}
