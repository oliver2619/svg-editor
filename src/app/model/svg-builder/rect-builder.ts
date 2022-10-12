import { SvgElementBuilderImp } from './svg-element-builder';
import { FilledElementBuilder, FilledElementBuilderImp } from './filled-element-builder';
import { StrokedElementBuilder, StrokedElementBuilderImp } from './stroked-element-builder';
import { ShapeBuilder, ShapeBuilderImp } from './shape-builder';
import { VectorEffect } from '../vector-effect';
import { LineCap, LineJoin } from '../line-properties';

export class RectBuilder implements ShapeBuilder<SVGRectElement>, StrokedElementBuilder, FilledElementBuilder {

	private readonly svg: SvgElementBuilderImp;
	private readonly shape: ShapeBuilderImp;
	private readonly fill: FilledElementBuilderImp;
	private readonly stroke: StrokedElementBuilderImp;

	constructor(readonly element: SVGRectElement) {
		this.svg = new SvgElementBuilderImp(element);
		this.shape = new ShapeBuilderImp(element);
		this.fill = new FilledElementBuilderImp(element);
		this.stroke = new StrokedElementBuilderImp(element);
	}

	setRotation(deg: number, px: number, py: number) {
		if (deg !== 0) {
			this.element.setAttribute('transform', `rotate(${deg} ${px} ${py})`);
		} else {
			this.element.removeAttribute('transform');
		}
	}

	setRadius(rx: number, ry: number) {
		if (rx > 0) {
			this.element.rx.baseVal.value = rx;
		}
		if (ry > 0) {
			this.element.ry.baseVal.value = ry;
		}
	}

	setRect(x: number, y: number, width: number, height: number) {
		this.element.x.baseVal.value = x;
		this.element.y.baseVal.value = y;
		this.element.width.baseVal.value = width;
		this.element.height.baseVal.value = height;
	}

	setSize(width: number, height: number) {
		this.element.width.baseVal.value = width;
		this.element.height.baseVal.value = height;
	}

	setAttribute(name: string, value: any): void {
		this.svg.setAttribute(name, value);
	}

	setClass(cssClass: string): void {
		this.svg.setClass(cssClass);
	}

	setId(id: string) {
		this.svg.setId(id);
	}

	setFillOpacity(opacity: number): void {
		this.fill.setFillOpacity(opacity);
	}

	setFillColor(color: string): void {
		this.fill.setFillColor(color);
	}

	setStrokeWidth(width: number): void {
		this.stroke.setStrokeWidth(width);
	}

	setStrokeOpacity(opacity: number): void {
		this.stroke.setStrokeOpacity(opacity);
	}

	setStrokeDashArray(array: number[]): void {
		this.stroke.setStrokeDashArray(array);
	}

	setStrokeColor(color: string): void {
		this.stroke.setStrokeColor(color);
	}

	setLineJoin(join: LineJoin): void {
		this.stroke.setLineJoin(join);
	}

	setLineCap(cap: LineCap): void {
		this.stroke.setLineCap(cap);
	}

	setVectorEffect(effect: VectorEffect): void {
		this.shape.setVectorEffect(effect);
	}

	setOpacity(opacity: number): void {
		this.shape.setOpacity(opacity);
	}
}

