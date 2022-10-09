import { MutableSvgModel } from '../svg-model';
import { SvgBuilder } from '../svg-builder/svg-builder';
import { ShapeModelImp } from './shape-model-imp';
import { EllipseModelImp } from './ellipse-model-imp';
import { LineModelImp } from './line-model-imp';
import { PathModelImp } from './path-model-imp';
import { PolylineModelImp } from './polyline-model-imp';
import { PolygonModelImp } from './polygon-model-imp';
import { RectModelImp } from './rect-model-imp';
import { GroupModelImp } from './group-model-imp';
import { CircleProperties, EllipseProperties, GroupProperties, LineProperties, PatternProperties, PolylineProperties, PolygonProperties, RectProperties, ImageProperties } from '../model-element-properties';
import { ShapeModel, ShapeModelType } from '../shape-model';
import { ShapeContainerModelImp } from './shape-container-model-imp';
import { CircleModelImp } from './circle-model-imp';
import { ImageModelImp } from './image-model-imp';
import { PathProperties } from '../path-properties';

export class SvgModelImp implements MutableSvgModel {

	private readonly shapeContainer = new ShapeContainerModelImp();
	private readonly shapesById = new Map<string, ShapeModelImp>();

	get height(): number { return this._height; }

	get title(): string { return this._title; }

	get width(): number { return this._width; }

	constructor(private _width: number, private _height: number, private _title: string) {
	}

	addCircle(id: string, properties: CircleProperties, parent: string | undefined) {
		const r = new CircleModelImp(id, parent, properties);
		this.addShape(r, parent, undefined);
	}

	addCircularGradient() {
		throw new Error("Method not implemented.");
	}

	addEllipse(id: string, properties: EllipseProperties, parent: string | undefined) {
		const r = new EllipseModelImp(id, parent, properties);
		this.addShape(r, parent, undefined);
	}

	addFilter() {
		throw new Error("Method not implemented.");
	}

	addGroup(id: string, properties: GroupProperties, parent: string | undefined, zIndex: number | undefined) {
		const g = new GroupModelImp(id, parent, properties);
		this.addShape(g, parent, zIndex);
	}

	addImage(id: string, properties: ImageProperties, parent: string | undefined) {
		const i = new ImageModelImp(id, parent, properties);
		this.addShape(i, parent, undefined);
	}

	addLine(id: string, properties: LineProperties, parent: string | undefined) {
		const l = new LineModelImp(id, parent, properties);
		this.addShape(l, parent, undefined);
	}

	addLinearGradient() {
		throw new Error("Method not implemented.");
	}

	addMarker() {
		throw new Error("Method not implemented.");
	}

	addPath(id: string, properties: PathProperties, parent: string | undefined) {
		const p = new PathModelImp(id, parent, properties);
		this.addShape(p, parent, undefined);
	}

	addPattern(id: string, properties: PatternProperties) {
		throw new Error("Method not implemented.");
	}

	addPolyline(id: string, properties: PolylineProperties, parent: string | undefined) {
		const p = new PolylineModelImp(id, parent, properties);
		this.addShape(p, parent, undefined);
	}

	addPolygon(id: string, properties: PolygonProperties, parent: string | undefined) {
		const p = new PolygonModelImp(id, parent, properties);
		this.addShape(p, parent, undefined);
	}

	addRect(id: string, properties: RectProperties, parent: string | undefined) {
		const r = new RectModelImp(id, parent, properties);
		this.addShape(r, parent, undefined);
	}

	canMoveShapeBackward(id: string): boolean {
		const parent = this.getShapeParent(id);
		if (parent !== undefined) {
			return parent.canMoveShapeBackward(id);
		} else {
			return this.shapeContainer.canMoveShapeBackward(id);
		}
	}

	canMoveShapeForward(id: string): boolean {
		const parent = this.getShapeParent(id);
		if (parent !== undefined) {
			return parent.canMoveShapeForward(id);
		} else {
			return this.shapeContainer.canMoveShapeForward(id);
		}
	}

	createSvg(builder: SvgBuilder) {
		builder.setSize(this._width, this._height);
		builder.setTitle(this._title);
		this.shapeContainer.buildSvg(builder);
	}

	exportSvg(): string {
		const outer = document.createElement('div');
		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		outer.appendChild(svg);
		const builder = new SvgBuilder(svg);
		this.createSvg(builder);
		return outer.innerHTML;
	}

	getShapeMaxZIndex(id: string): number {
		const parent = this.getShapeParent(id);
		if (parent !== undefined) {
			return parent.getShapeMaxZIndex(id);
		} else {
			return this.shapeContainer.getShapeMaxZIndex(id);
		}
	}

	getShapeMnemento(id: string): any { return this.getShapeById(id).getMnemento(); }

	getShapeParent(id: string): GroupModelImp | undefined {
		const shape = this.getShapeById(id);
		if (shape.parentId !== undefined) {
			return this.getParent(shape.parentId);
		} else {
			return undefined;
		}
	}

	getShapeRootParent(id: string): GroupModelImp | undefined {
		let ret = this.getShapeParent(id);
		if (ret === undefined) {
			return undefined;
		}
		while (ret.parentId !== undefined) {
			ret = this.getParent(ret.parentId);
		}
		return ret;
	}

	getShapeZIndex(id: string): number {
		const parent = this.getShapeParent(id);
		if (parent !== undefined) {
			return parent.getShapeZIndex(id);
		} else {
			return this.shapeContainer.getShapeZIndex(id);
		}
	}

	getTopLevelShapes(): ShapeModel[] { return this.shapeContainer.getTopLevelShapes(); }

	getTopLevelShapeIds(): string[] { return this.shapeContainer.getTopLevelShapes().map(s => s.id); }

	getTransformableShapes(shapeId: string): string[] {
		return this.getShapeById(shapeId).getTransformableShapes();
	}

	hasShape(id: string): boolean { return this.shapesById.get(id) !== undefined; }

	importSvg(svg: string) {

	}

	isGroup(id: string): boolean { return this.getShapeById(id).type === ShapeModelType.GROUP; }

	moveShapeToGroup(shapeId: string, parentId: string | undefined, zIndex: number | undefined) {
		const shape = this.getShapeById(shapeId);
		const oldParent = this.getShapeParent(shapeId);
		if (oldParent !== undefined) {
			oldParent.removeShape(shapeId);
		} else {
			this.shapeContainer.removeShape(shapeId);
		}
		shape.parentId = parentId;
		const newParent = parentId !== undefined ? this.getShapeById(parentId) as GroupModelImp : undefined;
		if (newParent !== undefined) {
			if (newParent.type !== ShapeModelType.GROUP) {
				throw new RangeError(`Shape ${parentId} is not a group`);
			}
			newParent.addShape(shape, zIndex);
		} else {
			this.shapeContainer.addShape(shape, zIndex);
		}
	}

	moveShapeToZIndex(shapeId: string, zIndex: number) {
		const parent = this.getShapeParent(shapeId);
		if (parent !== undefined) {
			parent.setShapeZIndex(shapeId, zIndex);
		} else {
			this.shapeContainer.setShapeZIndex(shapeId, zIndex);
		}
	}

	removeFilter(id: string) {
	}

	removeGradient(id: string) {
	}

	removeMarker(id: string) {
	}

	removePattern(id: string) {
	}

	removeShape(id: string) {
		const parent = this.getShapeParent(id);
		if (parent !== undefined) {
			parent.removeShape(id);
		} else {
			this.shapeContainer.removeShape(id);
		}
	}

	setShapeMnemento(id: string, m: any) { this.getShapeById(id).setMnemento(m); }

	setSize(width: number, height: number) {
		this._width = width;
		this._height = height;
	}

	setTitle(title: string) { this._title = title; }

	translateShape(id: string, dx: number, dy: number) {
		this.getShapeById(id).translate(dx, dy);
	}

	private addShape(shape: ShapeModelImp, parent: string | undefined, zIndex: number | undefined) {
		if (parent === undefined) {
			this.shapeContainer.addShape(shape, zIndex);
		} else {
			this.getParent(parent).addShape(shape, zIndex);
		}
		this.shapesById.set(shape.id, shape);
	}

	private getParent(parentId: string): GroupModelImp {
		const parent = this.getShapeById(parentId);
		if (!(parent instanceof GroupModelImp)) {
			throw new RangeError(`Parent shape ${parentId} not found or is no group`);
		}
		return parent;
	}

	private getShapeById(id: string): ShapeModelImp {
		const shape = this.shapesById.get(id);
		if (shape === undefined) {
			throw new RangeError(`Shape ${id} not found`);
		}
		return shape;
	}
}