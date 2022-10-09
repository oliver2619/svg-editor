import { ShapeContainerBuilder, ShapeContainerBuilderImp } from './shape-container-builder';
import { EllipseBuilder } from './ellipse-builder';
import { GroupBuilder } from './group-builder';
import { LineBuilder } from './line-builder';
import { PathBuilder } from './path-builder';
import { PolygonBuilder } from './polygon-builder';
import { PolylineBuilder } from './polyline-builder';
import { RectBuilder } from './rect-builder';
import { DefsBuilder } from './defs-builder';
import { CircleBuilder } from './circle-builder';
import { SvgElementBuilder, SvgElementBuilderImp } from './svg-element-builder';
import { ImageBuilder } from './image-builder';

export class SvgBuilder implements ShapeContainerBuilder, SvgElementBuilder<SVGSVGElement> {

	readonly defs: DefsBuilder;

	private readonly container: ShapeContainerBuilderImp;
	private readonly svgElementBuilder: SvgElementBuilderImp;

	constructor(readonly element: SVGSVGElement) {
		this.container = new ShapeContainerBuilderImp(element);
		this.svgElementBuilder = new SvgElementBuilderImp(element);
		let defsElement = element.querySelector('defs');
		if (defsElement === null) {
			defsElement = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
			this.element.appendChild(defsElement);
		}
		this.defs = new DefsBuilder(defsElement);
	}

	clearAllContent() {
		this.element.innerHTML = '';
	}

	setAttribute(name: string, value: any): void {
		this.svgElementBuilder.setAttribute(name, value);
	}

	setClass(cssClass: string): void {
		this.svgElementBuilder.setClass(cssClass);
	}

	setId(id: string) {
		this.svgElementBuilder.setId(id);
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

	setPosition(x: number, y: number) {
		this.element.x.baseVal.value = x;
		this.element.y.baseVal.value = y;
	}

	setSize(width: number, height: number) {
		this.element.setAttribute('width', String(width));
		this.element.setAttribute('height', String(height));
		this.element.setAttribute('viewBox', `0 0 ${width} ${height}`);
	}

	setTitle(title: string) {
		let titleElement = this.element.querySelector('title') as SVGTitleElement | null;
		if (title.length > 0) {
			if (titleElement === null) {
				titleElement = document.createElementNS('http://www.w3.org/2000/svg', 'title');
				this.element.insertBefore(titleElement, null);
			}
			titleElement.textContent = title;
		} else if (titleElement !== null) {
			titleElement.remove();
		}
	}
}