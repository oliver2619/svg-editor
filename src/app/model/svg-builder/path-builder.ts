import { SvgElementBuilderImp } from './svg-element-builder';
import { FilledElementBuilder, FilledElementBuilderImp } from './filled-element-builder';
import { StrokedElementBuilder, StrokedElementBuilderImp } from './stroked-element-builder';
import { ShapeBuilder, ShapeBuilderImp } from './shape-builder';
import { VectorEffect } from '../vector-effect';
import { LineCap, LineJoin } from '../line-properties';
import { Coordinate } from '../coordinate';
import { PathCmdBezierCurveToProperties, PathCmdContinueBezierCurveToProperties, PathCmdContinueQuadCurveToProperties, PathCmdLineToProperties, PathCmdMoveProperties, PathCmdProperties, PathCmdQuadCurveToProperties } from '../path-properties';

export class PathElementsBuilder {

	private firstPoint: Coordinate | undefined;
	private lastPoint: Coordinate | undefined;

	constructor(private readonly element: SVGPathElement) { }

	bezierCurveTo(hx1: number, hy1: number, hx2: number, hy2: number, x: number, y: number) {
		this.checkLastVertex();
		this.append(`C ${hx1} ${hy1}, ${hx2} ${hy2}, ${x} ${y}`);
		this.lastPoint = new Coordinate(x, y);
		return this;
	}

	clearPath() {
		this.element.setAttribute('d', '');
		this.firstPoint = undefined;
		this.lastPoint = undefined;
	}

	closePath() {
		this.checkLastVertex();
		this.append('Z');
		this.lastPoint = this.firstPoint?.clone();
		return this;
	}

	continueBezierCurveTo(hx: number, hy: number, x: number, y: number) {
		this.checkLastVertex();
		this.append(`S ${hx} ${hy}, ${x} ${y}`);
		this.lastPoint = new Coordinate(x, y);
		return this;
	}

	continueQuadraticCurveTo(x: number, y: number) {
		this.checkLastVertex();
		this.append(`T ${x} ${y}`);
		this.lastPoint = new Coordinate(x, y);
		return this;
	}

	lineTo(x: number, y: number) {
		this.checkLastVertex();
		if (this.lastPoint?.x === x) {
			this.append(`V ${y}`);
		} else if (this.lastPoint?.y === y) {
			this.append(`H ${x}`);
		} else {
			this.append(`L ${x} ${y}`);
		}
		this.lastPoint = new Coordinate(x, y);
		return this;
	}

	moveTo(x: number, y: number) {
		this.append(`M ${x} ${y}`);
		this.firstPoint = new Coordinate(x, y);
		this.lastPoint = new Coordinate(x, y);
		return this;
	}

	quadraticCurveTo(hx: number, hy: number, x: number, y: number) {
		this.checkLastVertex();
		this.append(`Q ${hx} ${hy}, ${x} ${y}`);
		this.lastPoint = new Coordinate(x, y);
		return this;
	}

	command(p: PathCmdProperties) {
		switch (p.cmd) {
			case 'M':
				const m = p as PathCmdMoveProperties;
				this.moveTo(m.x, m.y);
				break;
			case 'L':
				const l = p as PathCmdLineToProperties;
				this.lineTo(l.x, l.y);
				break;
			case 'C':
				const c = p as PathCmdBezierCurveToProperties;
				this.bezierCurveTo(c.hx1, c.hy1, c.hx2, c.hy2, c.x, c.y);
				break;
			case 'S':
				const s = p as PathCmdContinueBezierCurveToProperties;
				this.continueBezierCurveTo(s.hx, s.hy, s.x, s.y);
				break;
			case 'Q':
				const q = p as PathCmdQuadCurveToProperties;
				this.quadraticCurveTo(q.hx, q.hy, q.x, q.y);
				break;
			case 'T':
				const t = p as PathCmdContinueQuadCurveToProperties;
				this.continueQuadraticCurveTo(t.x, t.y);
				break;
			case 'Z':
				this.closePath();
				break;
		}
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

	private checkLastVertex() {
		if (this.lastPoint === undefined) {
			throw new Error('No current vertex position set');
		}
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

