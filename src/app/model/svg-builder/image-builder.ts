import { ShapeBuilder, ShapeBuilderImp } from './shape-builder';
import { VectorEffect } from '../vector-effect';
import { SvgElementBuilderImp } from './svg-element-builder';

export class ImageBuilder implements ShapeBuilder<SVGImageElement> {

	private readonly svg: SvgElementBuilderImp;
	private readonly shape: ShapeBuilderImp;

	constructor(readonly element: SVGImageElement) {
		this.svg = new SvgElementBuilderImp(element);
		this.shape = new ShapeBuilderImp(element);
	}

	setUrl(url: string) {
		this.element.href.baseVal = url;
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