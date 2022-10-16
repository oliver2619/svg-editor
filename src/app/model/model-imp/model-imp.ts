import { MutableSvgModel } from '../svg-model';
import { SvgBuilder } from '../svg-builder/svg-builder';
import { ShapeModelImp } from './shape-model-imp';
import { EllipseModelImp } from './ellipse-model-imp';
import { LineModelImp } from './line-model-imp';
import { PathModelImp } from './path-model-imp';
import { RectModelImp } from './rect-model-imp';
import { GroupModelImp } from './group-model-imp';
import { CircleProperties, EllipseProperties, GroupProperties, LineProperties, PatternProperties, RectProperties, ImageProperties } from '../properties/model-element-properties';
import { ShapeModel, ShapeModelType } from '../shape-model';
import { ShapeContainerModelImp } from './shape-container-model-imp';
import { CircleModelImp } from './circle-model-imp';
import { ImageModelImp } from './image-model-imp';
import { PathProperties } from '../properties/path-properties';

export class SvgModelImp implements MutableSvgModel {

	private readonly shapeContainer = new ShapeContainerModelImp();
	private readonly shapesById = new Map<string, ShapeModelImp>();

	private _nextId = 0;
	private _title: string = '';

	get nextId(): string {
		const ret = this._nextId.toString(24);
		++this._nextId;
		return `_sid:${ret}`;
	}

	get height(): number { return this._height; }

	get title(): string { return this._title; }

	get width(): number { return this._width; }

	constructor(private _width: number, private _height: number) { }

	addCircle(id: string, properties: CircleProperties, parent: string | undefined, zIndex: number | undefined) {
		const r = new CircleModelImp(id, parent, properties);
		this.addShape(r, parent, zIndex);
	}

	addCircularGradient() {
		throw new Error("Method not implemented.");
	}

	addEllipse(id: string, properties: EllipseProperties, parent: string | undefined, zIndex: number | undefined) {
		const r = new EllipseModelImp(id, parent, properties);
		this.addShape(r, parent, zIndex);
	}

	addFilter() {
		throw new Error("Method not implemented.");
	}

	addGroup(id: string, properties: GroupProperties, parent: string | undefined, zIndex: number | undefined) {
		const g = new GroupModelImp(id, parent, properties);
		this.addShape(g, parent, zIndex);
	}

	addImage(id: string, properties: ImageProperties, parent: string | undefined, zIndex: number | undefined) {
		const i = new ImageModelImp(id, parent, properties);
		this.addShape(i, parent, zIndex);
	}

	addLine(id: string, properties: LineProperties, parent: string | undefined, zIndex: number | undefined) {
		const l = new LineModelImp(id, parent, properties);
		this.addShape(l, parent, zIndex);
	}

	addLinearGradient() {
		throw new Error("Method not implemented.");
	}

	addMarker() {
		throw new Error("Method not implemented.");
	}

	addPath(id: string, properties: PathProperties, parent: string | undefined, zIndex: number | undefined) {
		const p = new PathModelImp(id, parent, properties);
		this.addShape(p, parent, zIndex);
	}

	addPattern(id: string, properties: PatternProperties) {
		throw new Error("Method not implemented.");
	}

	addRect(id: string, properties: RectProperties, parent: string | undefined, zIndex: number | undefined) {
		const r = new RectModelImp(id, parent, properties);
		this.addShape(r, parent, zIndex);
	}

	addShape(shape: ShapeModelImp, parent: string | undefined, zIndex: number | undefined) {
		if (parent === undefined) {
			this.shapeContainer.addShape(shape, zIndex);
		} else {
			this.getParent(parent).addShape(shape, zIndex);
		}
		this.shapesById.set(shape.id, shape);
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

	flipShapeH(id: string, px: number): void { this.getShapeById(id).flipH(px); }

	flipShapeV(id: string, py: number): void { this.getShapeById(id).flipV(py); }

	getAllTransformableShapes(): string[] { return this.getTransformableShapes(this.shapeContainer.getTopLevelShapes().map(it => it.id)); }

	getGroups(id: string): string[] {
		return this.getShapeById(id).getGroups();
	}

	getShapeById(id: string): ShapeModelImp {
		const shape = this.shapesById.get(id);
		if (shape === undefined) {
			throw new RangeError(`Shape ${id} not found`);
		}
		return shape;
	}

	getShapeMaxZIndex(id: string): number {
		const parent = this.getShapeParent(id);
		if (parent !== undefined) {
			return parent.getShapeMaxZIndex(id);
		} else {
			return this.shapeContainer.getShapeMaxZIndex(id);
		}
	}

	getShapeNestingDepth(id: string): number {
		const parent = this.getShapeParent(id);
		return parent !== undefined ? this.getShapeNestingDepth(parent.id) + 1 : 0;
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

	getTransformableShapes(shapeIds: string[]): string[] {
		return Array.from(new Set<string>(shapeIds.flatMap(id => this.getShapeById(id).getTransformableShapes())));
	}

	hasShape(id: string): boolean { return this.shapesById.get(id) !== undefined; }

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

	replaceShapeWithCircle(id: string, properties: CircleProperties): void {
		const oldShape = this.getShapeById(id);
		const newShape = new CircleModelImp(id, oldShape.parentId, properties);
		this.replaceShape(oldShape, newShape);
	}

	replaceShapeWithEllipse(id: string, properties: EllipseProperties): void {
		const oldShape = this.getShapeById(id);
		const newShape = new EllipseModelImp(id, oldShape.parentId, properties);
		this.replaceShape(oldShape, newShape);
	}

	replaceShapeWithLine(id: string, properties: LineProperties): void {
		const oldShape = this.getShapeById(id);
		const newShape = new LineModelImp(id, oldShape.parentId, properties);
		this.replaceShape(oldShape, newShape);
	}

	replaceShapeWithPath(id: string, properties: PathProperties): void {
		const oldShape = this.getShapeById(id);
		const newShape = new PathModelImp(id, oldShape.parentId, properties);
		this.replaceShape(oldShape, newShape);
	}

	replaceShapeWithRect(id: string, properties: RectProperties): void {
		const oldShape = this.getShapeById(id);
		const newShape = new RectModelImp(id, oldShape.parentId, properties);
		this.replaceShape(oldShape, newShape);
	}

	rotateShape(id: string, deg: number, px: number, py: number) { this.getShapeById(id).rotate(deg, px, py); }

	scaleShape(id: string, sx: number, sy: number, px: number, py: number): void { this.getShapeById(id).scale(sx, sy, px, py); }

	setShapeMnemento(id: string, m: any) { this.getShapeById(id).setMnemento(m); }

	setSize(width: number, height: number) {
		this._width = width;
		this._height = height;
	}

	setTitle(title: string) { this._title = title; }

	translateShape(id: string, dx: number, dy: number) {
		this.getShapeById(id).translate(dx, dy);
	}

	private getParent(parentId: string): GroupModelImp {
		const parent = this.getShapeById(parentId);
		if (!(parent instanceof GroupModelImp)) {
			throw new RangeError(`Parent shape ${parentId} not found or is no group`);
		}
		return parent;
	}

	private replaceShape(oldShape: ShapeModelImp, newShape: ShapeModelImp) {
		this.shapesById.set(oldShape.id, newShape);
		if (oldShape.parentId === undefined) {
			this.shapeContainer.replaceShape(oldShape, newShape);
		} else {
			this.getParent(oldShape.parentId).replaceShape(oldShape, newShape);
		}
	}
}