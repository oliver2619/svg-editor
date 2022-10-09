import { VectorEffect } from '../vector-effect';
import { SvgElementBuilder } from './svg-element-builder';

export interface ShapeBuilder<E extends SVGElement> extends SvgElementBuilder<E> {

	setOpacity(opacity: number): void;

	setVectorEffect(effect: VectorEffect): void;
}

export class ShapeBuilderImp {

	constructor(private readonly element: SVGElement) { }

	setOpacity(opacity: number) {
		if (opacity !== 1) {
			this.element.setAttribute('opacity', String(opacity));
		} else {
			this.element.removeAttribute('opacity');
		}
	}

	setVectorEffect(effect: VectorEffect) {
		if (effect !== 'none') {
			this.element.setAttribute('vector-effect', effect);
		} else {
			this.element.removeAttribute('vector-effect');
		}
	}
}