import { ShapeBuilderImp } from './shape-builder';
import { VectorEffect } from '../vector-effect';
import { SvgElementBuilderImp } from './svg-element-builder';
import { BoxBuilder } from './box-builder';
import { ShapeProperties } from '../properties/model-element-properties';

export class ImageBuilder implements BoxBuilder<SVGImageElement> {

	private readonly svg: SvgElementBuilderImp;
	private readonly shape: ShapeBuilderImp;

	constructor(readonly element: SVGImageElement) {
		this.svg = new SvgElementBuilderImp(element);
		this.shape = new ShapeBuilderImp(element);
	}

	setShapeProperties(properties: ShapeProperties): void {
		this.shape.setShapeProperties(properties);
	}

	setUrl(url: string) {
		this.element.href.baseVal = url;
	}

	setRotation(deg: number, px: number, py: number) {
		if (deg !== 0) {
			this.element.setAttribute('transform', `rotate(${deg} ${px} ${py})`);
		} else {
			this.element.removeAttribute('transform');
		}
	}

	setRect(x: number, y: number, width: number, height: number) {
		this.element.x.baseVal.value = x;
		this.element.y.baseVal.value = y;
		this.element.width.baseVal.value = width;
		this.element.height.baseVal.value = height;
	}

	setId(id: string): void {
		this.svg.setId(id);
	}

	setClass(cssClass: string): void {
		this.svg.setClass(cssClass);
	}

	setAttribute(name: string, value: any): void {
		this.svg.setAttribute(name, value);
	}

	setVectorEffect(effect: VectorEffect): void {
		this.shape.setVectorEffect(effect);
	}

	setOpacity(opacity: number): void {
		this.shape.setOpacity(opacity);
	}

	preserveAspectRatio(preserve: boolean) {
		this.element.setAttribute('preserveAspectRatio', preserve ? 'xMidYMid meet' : 'none');
	}
}