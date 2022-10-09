import { SvgElementBuilderImp } from './svg-element-builder';
import { FilledElementBuilder, FilledElementBuilderImp } from './filled-element-builder';
import { StrokedElementBuilder, StrokedElementBuilderImp } from './stroked-element-builder';
import { ShapeBuilder, ShapeBuilderImp } from './shape-builder';
import { VectorEffect } from '../vector-effect';
import { LineCap, LineJoin } from '../line-properties';

export class PathElementsBuilder {

	constructor(private readonly element: SVGPathElement) { }

	bezierCurveTo(hx1: number, hy1: number, hx2: number, hy2: number, x: number, y: number) {
		this.append(`C ${hx1} ${hy1}, ${hx2} ${hy2}, ${x} ${y}`);
		return this;
	}

	clearPath() {
		this.element.setAttribute('d', '');
	}

	closePath() {
		this.append('Z');
		return this;
	}

	continueBezierCurveTo(hx: number, hy: number, x: number, y: number) {
		this.append(`S ${hx} ${hy}, ${x} ${y}`);
		return this;
	}

	continueQuadraticCurveTo(x: number, y: number) {
		this.append(`T ${x} ${y}`);
		return this;
	}

	horizontalLineTo(x: number) {
		this.append(`H ${x}`);
		return this;
	}

	verticalLineTo(y: number) {
		this.append(`V ${y}`);
		return this;
	}

	lineTo(x: number, y: number) {
		this.append(`L ${x} ${y}`);
		return this;
	}

	moveTo(x: number, y: number) {
		this.append(`M ${x} ${y}`);
		return this;
	}

	quadraticCurveTo(hx: number, hy: number, x: number, y: number) {
		this.append(`Q ${hx} ${hy}, ${x} ${y}`);
		return this;
	}

	private append(data: string) {
		let d = this.element.getAttribute('d');
		if (d === null || d.length === 0) {
			d = data;
		} else {
			d += ` ${data}`;
		}
		this.element.setAttribute('d', d);
	}
}

export class PathBuilder implements ShapeBuilder<SVGPathElement>, StrokedElementBuilder, FilledElementBuilder {

	readonly path: PathElementsBuilder;

	private readonly svg: SvgElementBuilderImp;
	private readonly shape: ShapeBuilderImp;
	private readonly fill: FilledElementBuilderImp;
	private readonly stroke: StrokedElementBuilderImp;

	constructor(readonly element: SVGPathElement) {
		this.svg = new SvgElementBuilderImp(element);
		this.shape = new ShapeBuilderImp(element);
		this.fill = new FilledElementBuilderImp(element);
		this.stroke = new StrokedElementBuilderImp(element);
		this.path = new PathElementsBuilder(element);
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

