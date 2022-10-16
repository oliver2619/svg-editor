import { FilledElementBuilder, FilledElementBuilderImp } from './filled-element-builder';
import { StrokedElementBuilder, StrokedElementBuilderImp } from './stroked-element-builder';
import { ShapeBuilder, ShapeBuilderImp } from './shape-builder';
import { LineJoin, LineCap } from '../line-properties';
import { VectorEffect } from '../vector-effect';
import { SvgElementBuilderImp } from './svg-element-builder';
import { BoxBuilder } from './box-builder';
import { FillProperties, ShapeProperties, StrokeProperties } from '../properties/model-element-properties';

export class EllipseBuilder implements BoxBuilder<SVGEllipseElement>, StrokedElementBuilder, FilledElementBuilder {

	private readonly svg: SvgElementBuilderImp;
	private readonly shape: ShapeBuilderImp;
	private readonly fill: FilledElementBuilderImp;
	private readonly stroke: StrokedElementBuilderImp;

	constructor(readonly element: SVGEllipseElement) {
		this.svg = new SvgElementBuilderImp(element);
		this.shape = new ShapeBuilderImp(element);
		this.fill = new FilledElementBuilderImp(element);
		this.stroke = new StrokedElementBuilderImp(element);
	}

	setShapeProperties(properties: ShapeProperties): void {
		this.shape.setShapeProperties(properties);
	}

	setFillProperties(properties: FillProperties): void {
		this.fill.setFillProperties(properties);
	}

	setStrokeProperties(properties: StrokeProperties): void {
		this.stroke.setStrokeProperties(properties);
	}

	setRotation(deg: number, px: number, py: number) {
		if (deg !== 0) {
			this.element.setAttribute('transform', `rotate(${deg} ${px} ${py})`);
		} else {
			this.element.removeAttribute('transform');
		}
	}

	setEllipse(cx: number, cy: number, rx: number, ry: number) {
		this.element.cx.baseVal.value = cx;
		this.element.cy.baseVal.value = cy;
		this.element.rx.baseVal.value = rx;
		this.element.ry.baseVal.value = ry;
	}

	setRect(x: number, y: number, width: number, height: number) {
		this.setEllipse(x + width * .5, y + height * .5, width * .5, height * .5);
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
