import { SpreadMethod } from '../color/linear-gradient';
import { Coordinate } from '../coordinate';

export class LinearGradientBuilder {

	constructor(private readonly element: SVGLinearGradientElement) { }

	addColorStop(offset: number, color: string, opacity: number | undefined): LinearGradientBuilder {
		const el = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
		this.element.appendChild(el);
		el.offset.baseVal = offset;
		el.setAttribute('stop-color', color);
		if (opacity !== undefined && opacity !== 1) {
			el.setAttribute('stop-opacity', String(opacity));
		}
		return this;
	}

	clearColorStops() {
		this.element.innerHTML = '';
	}

	setPath(start: Coordinate, end: Coordinate): LinearGradientBuilder {
		this.element.x1.baseVal.value = start.x;
		this.element.y1.baseVal.value = start.y;
		this.element.x2.baseVal.value = end.x;
		this.element.y2.baseVal.value = end.y;
		return this;
	}

	setSpreadMethod(spreadMethod: SpreadMethod): LinearGradientBuilder {
		if (spreadMethod === 'pad') {
			this.element.removeAttribute('spreadMethod');
		} else {
			this.element.setAttribute('spreadMethod', spreadMethod);
		}
		return this;
	}
}