import { EllipseBuilder } from './ellipse-builder';
import { LineBuilder } from './line-builder';
import { RectBuilder } from './rect-builder';
import { PolylineBuilder } from './polyline-builder';
import { PolygonBuilder } from './polygon-builder';
import { PathBuilder } from './path-builder';
import { GroupBuilder } from './group-builder';
import { CircleBuilder } from './circle-builder';
import { SvgBuilder } from './svg-builder';
import { ImageBuilder } from './image-builder';

export interface ShapeContainerBuilder {

	circle(cx: number, cy: number, r: number): CircleBuilder;

	clearShapes(): void;

	ellipse(cx: number, cy: number, rx: number, ry: number): EllipseBuilder;

	group(): GroupBuilder;

	image(url: string, x: number, y: number, width: number, height: number): ImageBuilder;

	line(x1: number, y1: number, x2: number, y2: number): LineBuilder;

	path(): PathBuilder;

	polygon(): PolygonBuilder;

	polyline(): PolylineBuilder;

	rect(x: number, y: number, width: number, height: number): RectBuilder;

	svg(): SvgBuilder;
}

export class ShapeContainerBuilderImp implements ShapeContainerBuilder {

	constructor(private readonly element: SVGElement) { }

	circle(cx: number, cy: number, r: number): CircleBuilder {
		const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
		const ret = new CircleBuilder(circle);
		ret.setCircle(cx, cy, r);
		this.element.appendChild(circle);
		return ret;
	}

	clearShapes() {
		this.element.querySelectorAll('circle,ellipse,g,image,line,path,polygon,polyline,rect,text,use').forEach(el => el.remove());
	}


	ellipse(cx: number, cy: number, rx: number, ry: number): EllipseBuilder {
		const ellipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
		const ret = new EllipseBuilder(ellipse);
		ret.setEllipse(cx, cy, rx, ry);
		this.element.appendChild(ellipse);
		return ret;
	}

	group(): GroupBuilder {
		const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
		this.element.appendChild(group);
		return new GroupBuilder(group);
	}

	image(url: string, x: number, y: number, width: number, height: number): ImageBuilder {
		const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
		const ret = new ImageBuilder(image);
		ret.setUrl(url);
		ret.setRect(x, y, width, height);
		this.element.appendChild(image);
		return ret;
	}

	line(x1: number, y1: number, x2: number, y2: number): LineBuilder {
		const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
		const ret = new LineBuilder(line);
		ret.setLine(x1, y1, x2, y2);
		this.element.appendChild(line);
		return ret;
	}

	path(): PathBuilder {
		const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		const ret = new PathBuilder(path);
		this.element.appendChild(path);
		return ret;
	}

	polygon(): PolygonBuilder {
		const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
		const ret = new PolygonBuilder(polygon);
		this.element.appendChild(polygon);
		return ret;
	}

	polyline(): PolylineBuilder {
		const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
		const ret = new PolylineBuilder(polyline);
		this.element.appendChild(polyline);
		return ret;
	}

	rect(x: number, y: number, width: number, height: number): RectBuilder {
		const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
		const ret = new RectBuilder(rect);
		ret.setRect(x, y, width, height);
		this.element.appendChild(rect);
		return ret;
	}

	svg(): SvgBuilder {
		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		const ret = new SvgBuilder(svg);
		this.element.appendChild(svg);
		return ret;
	}
}