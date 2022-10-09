import { SvgElementBuilderImp } from './svg-element-builder';
import { FilledElementBuilder, FilledElementBuilderImp } from './filled-element-builder';
import { StrokedElementBuilder, StrokedElementBuilderImp } from './stroked-element-builder';
import { ShapeBuilder, ShapeBuilderImp } from './shape-builder';
import { VectorEffect } from '../vector-effect';
import { LineCap, LineJoin } from '../line-properties';

export class PolygonBuilder implements ShapeBuilder<SVGPolygonElement>, StrokedElementBuilder, FilledElementBuilder {

	private readonly svg: SvgElementBuilderImp;
	private readonly shape: ShapeBuilderImp;
	private readonly fill: FilledElementBuilderImp;
	private readonly stroke: StrokedElementBuilderImp;

	constructor(readonly element: SVGPolygonElement) {
		this.svg = new SvgElementBuilderImp(element);
		this.shape = new ShapeBuilderImp(element);
		this.fill = new FilledElementBuilderImp(element);
		this.stroke = new StrokedElementBuilderImp(element);
	}

	addPoint(x: number, y: number) {
		let points = this.element.getAttribute('points');
		if (points === null || points.length === 0) {
			points = `${x},${y}`;
		} else {
			points += ` ${x},${y}`;
		}
		this.element.setAttribute('points', points);
		return this;
	}

	clearPoints() {
		this.element.setAttribute('points', '');
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
