import { LinearGradientBuilder } from './linear-gradient-builder';

export class DefsBuilder {

	constructor(private readonly element: SVGDefsElement) { }

	clear() {
		this.element.innerHTML = '';
	}

	linearGradient(id: string): LinearGradientBuilder {
		const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
		gradient.setAttribute('id', id);
		this.element.appendChild(gradient);
		return new LinearGradientBuilder(gradient);
	}
}