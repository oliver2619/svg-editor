import { ShapeModelImp } from './shape-model-imp';
import { FillModelImp } from './fill-model-imp';
import { StrokeModelImp } from './stroke-model-imp';
import { LineJoin } from '../line-properties';
import { ShapeContainerBuilder } from '../svg-builder/shape-container-builder';
import { PathCmdModelImp } from './path-cmd-model-imp';
import { PathProperties } from '../properties/path-properties';
import { ShapeModelType } from '../shape-model';
import { ViewContainerRef, ComponentRef } from '@angular/core';
import { ShapePropertiesComponent } from 'src/app/shape-properties/shape-properties.component';
import { MutableSvgModel } from '../svg-model';
import { FillProperties, ShapeProperties, StrokeProperties } from '../properties/model-element-properties';

export class PathModelImp extends ShapeModelImp {

	readonly canConvertToPath = true;
	readonly type = ShapeModelType.PATH;

	private path: PathCmdModelImp[];
	private fill: FillModelImp;
	private stroke: StrokeModelImp;
	private lineJoin: LineJoin;

	get isClosed(): boolean { return this.path.some(p => p.isClosed); }

	get isLinear(): boolean { return this.path.every(p => p.isLinear); }

	get numberOfSubPaths(): number { return this.path.filter(p => p.isNewSubPath).length; }

	constructor(id: string, parentId: string | undefined, properties: PathProperties) {
		super(id, parentId, properties);
		this.fill = new FillModelImp(properties.fill);
		this.stroke = new StrokeModelImp(properties.stroke);
		this.lineJoin = properties.lineJoin;
		this.path = properties.commands.map(c => PathCmdModelImp.create(c));
	}

	buildSvg(builder: ShapeContainerBuilder): void {
		if (this.isLinear && this.numberOfSubPaths === 1) {
			if (this.isClosed) {
				const polygon = builder.polygon();
				this.buildShapeAttributes(polygon);
				this.fill.buildAttributes(polygon);
				this.stroke.buildAttributes(polygon);
				polygon.setLineJoin(this.lineJoin);
				this.path.forEach(p => p.buildVertexList(polygon));
			} else {
				const polyline = builder.polyline();
				this.buildShapeAttributes(polyline);
				this.fill.buildAttributes(polyline);
				this.stroke.buildAttributes(polyline);
				polyline.setLineJoin(this.lineJoin);
				this.path.forEach(p => p.buildVertexList(polyline));
			}
		} else {
			const path = builder.path();
			this.buildShapeAttributes(path);
			this.fill.buildAttributes(path);
			this.stroke.buildAttributes(path);
			path.setLineJoin(this.lineJoin);
			this.path.forEach(p => p.buildPathElement(path.path));
		}
	}

	createPropertiesComponent(container: ViewContainerRef, model: MutableSvgModel): ComponentRef<any> {
		const ret = container.createComponent(ShapePropertiesComponent);
		ret.setInput('fill', true);
		ret.setInput('line-join', true);
		ret.instance.fillProperties = this.fill.getMnemento();
		ret.instance.strokeProperties = this.stroke.getMnemento();
		ret.instance.shapeProperties = this.getMnemento();
		ret.instance.lineJoin = this.getMnemento().lineJoin;
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
		ret.instance.onLineJoinChange.subscribe({
			next: (lineJoin: LineJoin) => {
				const p = this.getMnemento();
				p.lineJoin = lineJoin;
				model.setShapeMnemento(this.id, p);
			}
		});
		return ret;
	}

	flipH(px: number): void {
		this.path.forEach(p => p.flipH(px));
	}

	flipV(py: number): void {
		this.path.forEach(p => p.flipV(py));
	}

	getConvertToPathProperties(): PathProperties {
		return this.getMnemento();
	}

	override getMnemento(): PathProperties {
		return {
			...super.getMnemento(),
			fill: this.fill.getMnemento(),
			stroke: this.stroke.getMnemento(),
			lineJoin: this.lineJoin,
			commands: this.path.map(p => p.getMnemento())
		};
	}

	rotate(deg: number, px: number, py: number) {
		this.path.forEach(p => p.rotate(deg, px, py));
	}

	scale(sx: number, sy: number, px: number, py: number): void {
		this.path.forEach(p => p.scale(sx, sy, px, py));
	}

	override setMnemento(m: PathProperties) {
		super.setMnemento(m);
		this.fill = new FillModelImp(m.fill);
		this.stroke = new StrokeModelImp(m.stroke);
		this.lineJoin = m.lineJoin;
		this.path = m.commands.map(c => PathCmdModelImp.create(c));
	}

	translate(dx: number, dy: number) {
		this.path.forEach(p => p.translate(dx, dy));
	}
}
