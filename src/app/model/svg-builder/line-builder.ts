import { ShapeBuilder, ShapeBuilderImp } from './shape-builder';
import { StrokedElementBuilder, StrokedElementBuilderImp } from './stroked-element-builder';
import { SvgElementBuilderImp } from './svg-element-builder';
import { VectorEffect } from '../vector-effect';
import { LineCap, LineJoin } from '../line-properties';
import { ShapeProperties, StrokeProperties } from '../properties/model-element-properties';

export class LineBuilder implements ShapeBuilder<SVGLineElement>, StrokedElementBuilder {

	private readonly svg: SvgElementBuilderImp;
	private readonly shape: ShapeBuilderImp;
	private readonly stroke: StrokedElementBuilderImp;

	constructor(readonly element: SVGLineElement) {
		this.svg = new SvgElementBuilderImp(element);
		this.shape = new ShapeBuilderImp(element);
		this.stroke = new StrokedElementBuilderImp(element);
	}

	setShapeProperties(properties: ShapeProperties): void {
		this.shape.setShapeProperties(properties);
	}

	setStrokeProperties(properties: StrokeProperties): void {
		this.stroke.setStrokeProperties(properties);
	}

	setLine(x1: number, y1: number, x2: number, y2: number) {
		this.element.x1.baseVal.value = x1;
		this.element.y1.baseVal.value = y1;
		this.element.x2.baseVal.value = x2;
		this.element.y2.baseVal.value = y2;
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