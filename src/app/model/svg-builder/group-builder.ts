import { ShapeContainerBuilder, ShapeContainerBuilderImp } from './shape-container-builder';
import { SvgElementBuilderImp } from './svg-element-builder';
import { FilledElementBuilder, FilledElementBuilderImp } from './filled-element-builder';
import { StrokedElementBuilder, StrokedElementBuilderImp } from './stroked-element-builder';
import { ShapeBuilder, ShapeBuilderImp } from './shape-builder';
import { VectorEffect } from '../vector-effect';
import { LineCap, LineJoin } from '../line-properties';
import { EllipseBuilder } from './ellipse-builder';
import { LineBuilder } from './line-builder';
import { PathBuilder } from './path-builder';
import { PolygonBuilder } from './polygon-builder';
import { PolylineBuilder } from './polyline-builder';
import { RectBuilder } from './rect-builder';
import { CircleBuilder } from './circle-builder';
import { SvgBuilder } from './svg-builder';
import { ImageBuilder } from './image-builder';

export class GroupBuilder implements ShapeContainerBuilder, ShapeBuilder<SVGGElement>, StrokedElementBuilder, FilledElementBuilder {

	private readonly elementBuilder: SvgElementBuilderImp;
	private readonly shape: ShapeBuilderImp;
	private readonly fill: FilledElementBuilderImp;
	private readonly stroke: StrokedElementBuilderImp;
	private readonly container: ShapeContainerBuilderImp;

	constructor(readonly element: SVGGElement) {
		this.elementBuilder = new SvgElementBuilderImp(element);
		this.shape = new ShapeBuilderImp(element);
		this.fill = new FilledElementBuilderImp(element);
		this.stroke = new StrokedElementBuilderImp(element);
		this.container = new ShapeContainerBuilderImp(element);
	}

	svg(): SvgBuilder {
		return this.container.svg();
	}

	rect(x: number, y: number, width: number, height: number): RectBuilder {
		return this.container.rect(x, y, width, height);
	}

	polyline(): PolylineBuilder {
		return this.container.polyline();
	}

	polygon(): PolygonBuilder {
		return this.container.polygon();
	}

	path(): PathBuilder {
		return this.container.path();
	}

	line(x1: number, y1: number, x2: number, y2: number): LineBuilder {
		return this.container.line(x1, y1, x2, y2);
	}

	image(url: string, x: number, y: number, width: number, height: number): ImageBuilder {
		return this.container.image(url, x, y, width, height);
	}

	group(): GroupBuilder {
		return this.container.group();
	}

	ellipse(cx: number, cy: number, rx: number, ry: number): EllipseBuilder {
		return this.container.ellipse(cx, cy, rx, ry);
	}

	clearShapes(): void {
		this.container.clearShapes();
	}

	circle(cx: number, cy: number, r: number): CircleBuilder {
		return this.container.circle(cx, cy, r);
	}

	setAttribute(name: string, value: any): void {
		this.elementBuilder.setAttribute(name, value);
	}

	setClass(cssClass: string): void {
		this.elementBuilder.setClass(cssClass);
	}

	setId(id: string) {
		this.elementBuilder.setId(id);
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
