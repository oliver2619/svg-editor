import { ShapeModelImp } from './shape-model-imp';
import { ShapeContainerBuilder } from '../svg-builder/shape-container-builder';

export class ShapeContainerModelImp {

	private readonly shapes: Array<ShapeModelImp> = [];

	get size(): number { return this.shapes.length; }

	addShape(shape: ShapeModelImp, zIndex: number | undefined) {
		if (zIndex === undefined) {
			this.shapes.push(shape);
		} else {
			this.shapes.splice(zIndex, 0, shape);
		}
	}

	buildSvg(builder: ShapeContainerBuilder): void { this.shapes.forEach(child => child.buildSvg(builder)); }

	canMoveShapeBackward(id: string): boolean { return this.getShapeZIndex(id) > 0; }

	canMoveShapeForward(id: string): boolean {
		const i = this.getShapeZIndex(id);
		return i + 1 < this.shapes.length;
	}

	getShapeMaxZIndex(id: string): number { return this.shapes.length - 1; }

	getShapeZIndex(id: string): number {
		const ret = this.shapes.findIndex(s => s.id === id);
		if (ret < 0) {
			throw new RangeError(`Shape ${id} not found in container`);
		}
		return ret;
	}

	getTopLevelShapes(): ShapeModelImp[] { return this.shapes.slice(0); }

	removeShape(id: string) {
		const i = this.getShapeZIndex(id);
		this.shapes.splice(i, 1);
	}

	replaceShape(oldShape: ShapeModelImp, newShape: ShapeModelImp) {
		const i = this.shapes.findIndex(s => s.id === oldShape.id);
		if (i >= 0) {
			this.shapes[i] = newShape;
		} else {
			throw new Error(`Shape ${oldShape.id} not found in container`);
		}
	}

	setShapeZIndex(id: string, zIndex: number) {
		if (zIndex < 0 || zIndex >= this.shapes.length) {
			throw new RangeError(`Shape index ${zIndex} out of range`);
		}
		const i = this.getShapeZIndex(id);
		const s = this.shapes.splice(i, 1)[0];
		this.shapes.splice(zIndex, 0, s);
	}
}