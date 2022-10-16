import { ComponentRef, ViewContainerRef } from '@angular/core';
import { ShapePropertiesComponent } from 'src/app/shape-properties/shape-properties.component';
import { LineJoin } from '../line-properties';
import { FillProperties, RectProperties, ShapeProperties, StrokeProperties } from '../properties/model-element-properties';
import { PathProperties } from '../properties/path-properties';
import { PathPropertiesBuilder } from '../properties/path-properties-builder';
import { ShapeModelType } from '../shape-model';
import { ShapeContainerBuilder } from '../svg-builder/shape-container-builder';
import { MutableSvgModel } from '../svg-model';
import { BoxShapeModelImp } from './box-shape-model-imp';
import { FillModelImp } from './fill-model-imp';
import { StrokeModelImp } from './stroke-model-imp';

export class RectModelImp extends BoxShapeModelImp {

	readonly canConvertToPath = true;
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
		this.buildShapeAttributes(rect);
		this.buildBoxAttributes(rect);
		this.fill.buildAttributes(rect);
		this.stroke.buildAttributes(rect);
		rect.setLineJoin(this.lineJoin);
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

	getConvertToPathProperties(): PathProperties {
		const a = this.rotation * Math.PI / 180;
		const cs = Math.cos(a);
		const sn = Math.sin(a);
		const wx = this.width * cs;
		const wy = this.width * sn;
		const hy = this.height * cs;
		const hx = -this.height * sn;
		const commands = new PathPropertiesBuilder()
			.moveTo(this.x, this.y)
			.lineTo(this.x + hx, this.y + hy)
			.lineTo(this.x + wx + hx, this.y + wy + hy)
			.lineTo(this.x + wx, this.y + wy)
			.close()
			.getCommands();
		const ret: PathProperties = {
			...super.getMnemento(),
			fill: this.fill.getMnemento(),
			stroke: this.stroke.getMnemento(),
			lineJoin: this.lineJoin,
			commands
		}
		return ret;
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
