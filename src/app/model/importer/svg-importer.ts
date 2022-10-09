import { Color } from "../color/color";
import { ContextColor } from "../color/context-color";
import { NoColor } from "../color/no-color";
import { SingleColor } from "../color/single-color";
import { Coordinate } from "../coordinate";
import { LineCap, LineJoin, LinePattern } from "../line-properties";
import { FillProperties, ShapeProperties, StrokeProperties } from "../model-element-properties";
import { SvgModelImp } from "../model-imp/model-imp";
import { PathCmdBezierCurveToProperties, PathCmdCloseProperties, PathCmdContinueBezierCurveToProperties, PathCmdContinueQuadCurveToProperties, PathCmdHLineProperties, PathCmdLineToProperties, PathCmdMoveProperties, PathCmdProperties, PathCmdQuadCurveToProperties, PathCmdVLineProperties } from "../path-properties";
import { VectorEffect } from "../vector-effect";
import { ColorNameMapper } from "./color-name-mapper";

export class SvgImporter {

	private readonly idByImports = new Map<string, string>();

	private constructor(private readonly svg: SVGSVGElement, private readonly model: SvgModelImp) { }

	static importFromString(svg: string): SvgModelImp {
		const div = document.createElement('div');
		div.innerHTML = svg;
		const svgElement: SVGSVGElement = div.firstElementChild as SVGSVGElement;
		const ret = new SvgModelImp(svgElement.width.baseVal.value, svgElement.height.baseVal.value);
		new SvgImporter(svgElement, ret).importChildElements(svgElement, undefined);
		return ret;
	}

	static getInheritedAttribute(element: SVGElement, name: string): string | undefined {
		const ret = element.getAttribute(name);
		if (ret !== null) {
			return ret;
		}
		if (element.parentElement === null || !(element.parentElement instanceof SVGElement)) {
			return undefined;
		}
		return this.getInheritedAttribute(element.parentElement as SVGElement, name);
	}

	private importChildElements(element: SVGElement, parent: string | undefined) {
		Array.from(element.children).forEach(c => {
			switch (c.tagName) {
				case 'circle':
					this.importCircle(c as SVGCircleElement, parent);
					break;
				case 'ellipse':
					this.importEllipse(c as SVGEllipseElement, parent);
					break;
				case 'g':
					this.importGroup(c as SVGGElement, parent);
					break;
				case 'image':
					this.importImage(c as SVGImageElement, parent);
					break;
				case 'line':
					this.importLine(c as SVGLineElement, parent);
					break;
				case 'path':
					this.importPath(c as SVGPathElement, parent);
					break;
				case 'polygon':
					this.importPolygon(c as SVGPolygonElement, parent);
					break;
				case 'polyline':
					this.importPolyline(c as SVGPolylineElement, parent);
					break;
				case 'rect':
					this.importRect(c as SVGRectElement, parent);
					break;
				case 'defs': // ignore
					break;
				default:
					throw new Error(`Unable to process element ${c.tagName}`);
			}
		});
	}

	private importShapeProperties(e: SVGElement): ShapeProperties {
		const opacity = SvgImporter.getInheritedAttribute(e, 'opacity');
		const vectorEffect = SvgImporter.getInheritedAttribute(e, 'vector-effect');
		if (vectorEffect !== undefined) {
			switch (vectorEffect) {
				case 'none':
				case 'non-scaling-stroke':
				case 'non-scaling-size':
				case 'non-rotation':
				case 'fixed-position':
					break;
				default:
					throw new RangeError(`vector-effect ${vectorEffect} not supported`);
			}
		}
		const ret: ShapeProperties = {
			opacity: opacity !== undefined ? Number.parseFloat(opacity) : 1,
			vectorEffect: vectorEffect !== undefined ? vectorEffect as VectorEffect : 'none'
		};
		return ret;
	}

	private importColor(color: string | undefined, opacity: string | undefined): Color {
		if (color === undefined) {
			return ContextColor.INSTANCE;
		}
		switch (color) {
			case 'none':
				return NoColor.INSTANCE;
			case 'context-fill':
			case 'context-stroke':
				return ContextColor.INSTANCE;
		}
		const result = /url\(([^\)]*)\)/.exec(color);
		if (result !== null) {
			throw new Error('Color references are not implemented yet');
		} else {
			const ret: SingleColor = color[0] === '#' ? SingleColor.fromHexString(color.substring(1)) : ColorNameMapper.nameToColor(color);
			if (opacity !== undefined) {
				ret.alpha = Number.parseFloat(opacity);
			}
			return ret;
		}
	}

	private importFillProperties(e: SVGElement): FillProperties {
		const color = e.getAttribute('fill');
		const opacity = e.getAttribute('fill-opacity');
		const ret: FillProperties = {
			color: this.importColor(color !== null ? color : undefined, opacity !== null ? opacity : undefined)
		};
		return ret;
	}

	private importStrokeProperties(e: SVGElement): StrokeProperties {
		const color = e.getAttribute('stroke');
		const opacity = e.getAttribute('stroke-opacity');
		const ret: StrokeProperties = {
			color: this.importColor(color !== null ? color : undefined, opacity !== null ? opacity : undefined),
			linePattern: LinePattern.importFromSvg(e)
		};
		return ret;
	}

	private importLineCap(e: SVGElement): LineCap {
		const att = SvgImporter.getInheritedAttribute(e, 'stroke-linecap');
		if (att === undefined) {
			return 'butt';
		}
		switch (att) {
			case 'butt':
			case 'square':
			case 'round':
				return att as LineCap;
		}
		throw new RangeError(`stroke-linecap ${att} not supported`);
	}

	private importLineJoin(e: SVGElement): LineJoin {
		const att = SvgImporter.getInheritedAttribute(e, 'stroke-linejoin');
		if (att === undefined) {
			return 'arcs';
		}
		switch (att) {
			case 'arcs':
			case 'bevel':
			case 'round':
				return att as LineJoin;
		}
		throw new RangeError(`stroke-linejoin ${att} not supported`);
	}

	private importCircle(e: SVGCircleElement, parent: string | undefined) {
		const id = this.model.nextId;
		if (e.id !== '') {
			this.idByImports.set(e.id, id);
		}
		this.model.addCircle(id, {
			...this.importShapeProperties(e),
			cx: e.cx.baseVal.value,
			cy: e.cy.baseVal.value,
			r: e.r.baseVal.value,
			fill: this.importFillProperties(e),
			stroke: this.importStrokeProperties(e)
		}, parent);
	}

	private importEllipse(e: SVGEllipseElement, parent: string | undefined) {
		const id = this.model.nextId;
		if (e.id !== '') {
			this.idByImports.set(e.id, id);
		}
		this.model.addEllipse(id, {
			...this.importShapeProperties(e),
			cx: e.cx.baseVal.value,
			cy: e.cy.baseVal.value,
			rx: e.rx.baseVal.value,
			ry: e.ry.baseVal.value,
			fill: this.importFillProperties(e),
			stroke: this.importStrokeProperties(e)
		}, parent);
	}

	private importGroup(e: SVGGElement, parent: string | undefined) {
		const id = this.model.nextId;
		if (e.id !== '') {
			this.idByImports.set(e.id, id);
		}
		this.model.addGroup(id, {
			...this.importShapeProperties(e),
			fill: this.importFillProperties(e),
			stroke: this.importStrokeProperties(e),
			lineCap: this.importLineCap(e),
			lineJoin: this.importLineJoin(e)
		}, parent, undefined);
		this.importChildElements(e, id);
	}

	private importImage(e: SVGImageElement, parent: string | undefined) {
		const aspect = e.getAttribute('preserveAspectRatio');
		const url = e.getAttribute('url');
		if (aspect === null) {
			throw new RangeError(`No preserveAspectRatio set for image ${e.id}`)
		}
		if (url === null) {
			throw new RangeError('No url set for image ${e.id}');
		}
		switch (aspect) {
			case 'xMidYMid meet':
			case 'none':
				break;
			default:
				throw new RangeError(`preserveAspectRatio ${aspect} not supported`);
		}
		const id = this.model.nextId;
		if (e.id !== '') {
			this.idByImports.set(e.id, id);
		}
		this.model.addImage(id, {
			...this.importShapeProperties(e),
			x: e.x.baseVal.value,
			y: e.y.baseVal.value,
			width: e.width.baseVal.value,
			height: e.height.baseVal.value,
			url: url,
			preserveAspectRatio: aspect === 'xMidYMid meet'
		}, parent);
	}

	private importLine(e: SVGLineElement, parent: string | undefined) {
		const id = this.model.nextId;
		if (e.id !== '') {
			this.idByImports.set(e.id, id);
		}
		this.model.addLine(id, {
			...this.importShapeProperties(e),
			x1: e.x1.baseVal.value,
			y1: e.y1.baseVal.value,
			x2: e.x2.baseVal.value,
			y2: e.y2.baseVal.value,
			stroke: this.importStrokeProperties(e),
			lineCap: this.importLineCap(e)
		}, parent);
	}

	private importPathElements(e: SVGPathElement): PathCmdProperties[] {
		const d = e.getAttribute('d');
		if (d === null) {
			throw new RangeError(`d elements not set in path ${e.id}`)
		}
		const elements = d.split(/[ ,]+/);
		const ret: PathCmdProperties[] = [];
		for (let i = 0; i < elements.length; ++i) {
			switch (elements[i]) {
				case 'M':
					{
						const p: PathCmdMoveProperties = {
							cmd: 'M',
							x: Number.parseFloat(elements[i + 1]),
							y: Number.parseFloat(elements[i + 2])
						};
						i += 2;
						ret.push(p);
					}
					break;
				case 'V':
					{
						const p: PathCmdVLineProperties = {
							cmd: 'V',
							y: Number.parseFloat(elements[i + 2])
						};
						i += 1;
						ret.push(p);
					}
					break;
				case 'H':
					{
						const p: PathCmdHLineProperties = {
							cmd: 'H',
							x: Number.parseFloat(elements[i + 1])
						};
						i += 1;
						ret.push(p);
					}
					break;
				case 'L':
					{
						const p: PathCmdLineToProperties = {
							cmd: 'L',
							x: Number.parseFloat(elements[i + 1]),
							y: Number.parseFloat(elements[i + 2])
						};
						i += 2;
						ret.push(p);
					}
					break;
				case 'C':
					{
						const p: PathCmdBezierCurveToProperties = {
							cmd: 'C',
							hx1: Number.parseFloat(elements[i + 1]),
							hy1: Number.parseFloat(elements[i + 2]),
							hx2: Number.parseFloat(elements[i + 3]),
							hy2: Number.parseFloat(elements[i + 4]),
							x: Number.parseFloat(elements[i + 5]),
							y: Number.parseFloat(elements[i + 6])
						};
						i += 6;
						ret.push(p);
					}
					break;
				case 'S':
					{
						const p: PathCmdContinueBezierCurveToProperties = {
							cmd: 'S',
							hx: Number.parseFloat(elements[i + 1]),
							hy: Number.parseFloat(elements[i + 2]),
							x: Number.parseFloat(elements[i + 3]),
							y: Number.parseFloat(elements[i + 4])
						};
						i += 4;
						ret.push(p);
					}
					break;
				case 'Q':
					{
						const p: PathCmdQuadCurveToProperties = {
							cmd: 'Q',
							hx: Number.parseFloat(elements[i + 1]),
							hy: Number.parseFloat(elements[i + 2]),
							x: Number.parseFloat(elements[i + 3]),
							y: Number.parseFloat(elements[i + 4])
						};
						i += 4;
						ret.push(p);
					}
					break;
				case 'T':
					{
						const p: PathCmdContinueQuadCurveToProperties = {
							cmd: 'T',
							x: Number.parseFloat(elements[i + 1]),
							y: Number.parseFloat(elements[i + 2])
						};
						i += 2;
						ret.push(p);
					}
					break;
				case 'Z':
					{
						const p: PathCmdCloseProperties = { cmd: 'Z' };
						ret.push(p);
					}
					break;
				default:
					throw new RangeError(`Path command ${elements[i]} not supported`);
			}
		}
		return ret;
	}

	private importPath(e: SVGPathElement, parent: string | undefined) {
		const id = this.model.nextId;
		if (e.id !== '') {
			this.idByImports.set(e.id, id);
		}
		this.model.addPath(id, {
			...this.importShapeProperties(e),
			commands: this.importPathElements(e),
			fill: this.importFillProperties(e),
			stroke: this.importStrokeProperties(e),
			lineCap: this.importLineCap(e),
			lineJoin: this.importLineJoin(e)
		}, parent);
	}

	private importPolygon(e: SVGPolygonElement, parent: string | undefined) {
		const id = this.model.nextId;
		if (e.id !== '') {
			this.idByImports.set(e.id, id);
		}
		this.model.addPolygon(id, {
			...this.importShapeProperties(e),
			points: Array.from(e.points).map(it => new Coordinate(it.x, it.y)),
			fill: this.importFillProperties(e),
			stroke: this.importStrokeProperties(e),
			lineJoin: this.importLineJoin(e)
		}, parent);
	}

	private importPolyline(e: SVGPolylineElement, parent: string | undefined) {
		const id = this.model.nextId;
		if (e.id !== '') {
			this.idByImports.set(e.id, id);
		}
		this.model.addPolyline(id, {
			...this.importShapeProperties(e),
			points: Array.from(e.points).map(it => new Coordinate(it.x, it.y)),
			fill: this.importFillProperties(e),
			stroke: this.importStrokeProperties(e),
			lineCap: this.importLineCap(e),
			lineJoin: this.importLineJoin(e)
		}, parent);
	}

	private importRect(e: SVGRectElement, parent: string | undefined) {
		const id = this.model.nextId;
		if (e.id !== '') {
			this.idByImports.set(e.id, id);
		}
		this.model.addRect(id, {
			...this.importShapeProperties(e),
			x: e.x.baseVal.value,
			y: e.y.baseVal.value,
			width: e.width.baseVal.value,
			height: e.height.baseVal.value,
			rx: e.rx.baseVal.value,
			ry: e.ry.baseVal.value,
			fill: this.importFillProperties(e),
			stroke: this.importStrokeProperties(e),
			lineJoin: this.importLineJoin(e),
		}, parent);
	}
}