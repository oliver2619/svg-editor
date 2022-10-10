import { ShapeModelImp } from './shape-model-imp';
import { ShapeContainerBuilder } from '../svg-builder/shape-container-builder';
import { FillModelImp } from './fill-model-imp';
import { StrokeModelImp } from './stroke-model-imp';
import { LineJoin, LineCap } from '../line-properties';
import { GroupProperties } from '../model-element-properties';
import { ShapeModelType, GroupModel, ShapeModel } from '../shape-model';
import { ShapeContainerModelImp } from './shape-container-model-imp';

export class GroupModelImp extends ShapeModelImp implements GroupModel {

	readonly type = ShapeModelType.GROUP;

	private readonly container = new ShapeContainerModelImp();

	private fill: FillModelImp | undefined;
	private stroke: StrokeModelImp | undefined;
	private lineJoin: LineJoin | undefined;
	private lineCap: LineCap | undefined;

	get size(): number { return this.container.size; }

	constructor(id: string, parentId: string | undefined, properties: GroupProperties) {
		super(id, parentId, properties);
		this.fill = properties.fill !== undefined ? new FillModelImp(properties.fill) : undefined;
		this.stroke = properties.stroke !== undefined ? new StrokeModelImp(properties.stroke) : undefined;
		this.lineCap = properties.lineCap;
		this.lineJoin = properties.lineJoin;
	}

	addShape(shape: ShapeModelImp, zIndex: number | undefined) { this.container.addShape(shape, zIndex); }

	buildSvg(builder: ShapeContainerBuilder): void {
		const group = builder.group();
		this.buildShapeAttributes(group);
		if (this.fill !== undefined) {
			this.fill.buildAttributes(group);
		}
		if (this.stroke !== undefined) {
			this.stroke.buildAttributes(group);
		}
		if (this.lineCap !== undefined) {
			group.setLineCap(this.lineCap);
		}
		if (this.lineJoin !== undefined) {
			group.setLineJoin(this.lineJoin);
		}
		this.container.buildSvg(group);
	}

	canMoveShapeBackward(id: string): boolean { return this.container.canMoveShapeBackward(id); }

	canMoveShapeForward(id: string): boolean { return this.container.canMoveShapeForward(id); }

	override getGroups(): string[] { return [this.id, ...this.container.getTopLevelShapes().flatMap(s => s.getGroups())]; }

	override getMnemento(): GroupProperties {
		return {
			...super.getMnemento(),
			fill: this.fill !== undefined ? this.fill.getMnemento() : undefined,
			stroke: this.stroke !== undefined ? this.stroke.getMnemento() : undefined,
			lineCap: this.lineCap,
			lineJoin: this.lineJoin
		};
	}

	getShapeMaxZIndex(id: string): number { return this.container.getShapeMaxZIndex(id); }

	getShapeZIndex(id: string): number { return this.container.getShapeZIndex(id); }

	getTopLevelShapes(): ShapeModel[] { return this.container.getTopLevelShapes(); }

	override getTransformableShapes(): string[] {
		return this.container.getTopLevelShapes().flatMap(s => s.getTransformableShapes());
	}

	removeShape(id: string) { this.container.removeShape(id); }

	override setMnemento(m: GroupProperties) {
		super.setMnemento(m);
		this.fill = m.fill !== undefined ? new FillModelImp(m.fill) : undefined;
		this.stroke = m.stroke !== undefined ? new StrokeModelImp(m.stroke) : undefined;
		this.lineCap = m.lineCap;
		this.lineJoin = m.lineJoin;
	}

	setShapeZIndex(id: string, zIndex: number) { this.container.setShapeZIndex(id, zIndex); }


	translate(dx: number, dy: number) {
	}
}
