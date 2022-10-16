import { ShapeModelImp } from './shape-model-imp';
import { ShapeContainerBuilder } from '../svg-builder/shape-container-builder';
import { FillModelImp } from './fill-model-imp';
import { StrokeModelImp } from './stroke-model-imp';
import { LineJoin } from '../line-properties';
import { FillProperties, GroupProperties, ShapeProperties, StrokeProperties } from '../properties/model-element-properties';
import { ShapeModelType, GroupModel, ShapeModel } from '../shape-model';
import { ShapeContainerModelImp } from './shape-container-model-imp';
import { PathProperties } from '../properties/path-properties';
import { ComponentRef, ViewContainerRef } from '@angular/core';
import { ShapePropertiesComponent } from 'src/app/shape-properties/shape-properties.component';
import { MutableSvgModel } from '../svg-model';

export class GroupModelImp extends ShapeModelImp implements GroupModel {

	readonly canConvertToPath = false;
	readonly type = ShapeModelType.GROUP;

	private readonly container = new ShapeContainerModelImp();

	private fill: FillModelImp | undefined;
	private stroke: StrokeModelImp | undefined;
	private lineJoin: LineJoin | undefined;

	get size(): number { return this.container.size; }

	constructor(id: string, parentId: string | undefined, properties: GroupProperties) {
		super(id, parentId, properties);
		this.fill = properties.fill !== undefined ? new FillModelImp(properties.fill) : undefined;
		this.stroke = properties.stroke !== undefined ? new StrokeModelImp(properties.stroke) : undefined;
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
		if (this.lineJoin !== undefined) {
			group.setLineJoin(this.lineJoin);
		}
		this.container.buildSvg(group);
	}

	canMoveShapeBackward(id: string): boolean { return this.container.canMoveShapeBackward(id); }

	canMoveShapeForward(id: string): boolean { return this.container.canMoveShapeForward(id); }

	createPropertiesComponent(container: ViewContainerRef, model: MutableSvgModel): ComponentRef<any> {
		const ret = container.createComponent(ShapePropertiesComponent);
		ret.setInput('fill', true);
		ret.setInput('line-join', true);
		if(this.fill !== undefined) {
			ret.instance.fillProperties = this.fill.getMnemento();
		}
		if(this.stroke !== undefined) {
			ret.instance.strokeProperties = this.stroke.getMnemento();
		}
		ret.instance.shapeProperties = this.getMnemento();
		if(this.lineJoin !== undefined) {
			ret.instance.lineJoin = this.lineJoin;
		}
		ret.instance.onFillChange.subscribe({
			next: (fill: FillProperties) => {
				const p = this.getMnemento();
				p.fill = fill;
				model.setShapeMnemento(this.id, p);
			}
		});
		ret.instance.onStrokeChange.subscribe({
			next: (stroke: StrokeProperties) => {
				const p = this.getMnemento();
				p.stroke = stroke;
				model.setShapeMnemento(this.id, p);
			}
		});
		ret.instance.onShapeChange.subscribe({
			next: (shape: ShapeProperties) => {
				const p = { ...this.getMnemento(), ...shape };
				model.setShapeMnemento(this.id, p);
			}
		});
		return ret;
	}

	flipH(px: number): void { }

	flipV(py: number): void { }

	getConvertToPathProperties(): PathProperties {
		throw new Error('Group can\'t be converted to a path');
	}

	override getGroups(): string[] { return [this.id, ...this.container.getTopLevelShapes().flatMap(s => s.getGroups())]; }

	override getMnemento(): GroupProperties {
		return {
			...super.getMnemento(),
			fill: this.fill !== undefined ? this.fill.getMnemento() : undefined,
			stroke: this.stroke !== undefined ? this.stroke.getMnemento() : undefined,
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

	replaceShape(oldShape: ShapeModelImp, newShape: ShapeModelImp) { this.container.replaceShape(oldShape, newShape); }

	rotate(deg: number, px: number, py: number) { }

	scale(sx: number, sy: number, px: number, py: number): void { }

	override setMnemento(m: GroupProperties) {
		super.setMnemento(m);
		this.fill = m.fill !== undefined ? new FillModelImp(m.fill) : undefined;
		this.stroke = m.stroke !== undefined ? new StrokeModelImp(m.stroke) : undefined;
		this.lineJoin = m.lineJoin;
	}

	setShapeZIndex(id: string, zIndex: number) { this.container.setShapeZIndex(id, zIndex); }


	translate(dx: number, dy: number) {
	}
}
