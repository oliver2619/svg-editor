import { Coordinate } from '../coordinate';
import { GradientBuilder } from './gradient-builder';

export class LinearGradientBuilder extends GradientBuilder {

	constructor(readonly element: SVGLinearGradientElement) { super(); }

	setPath(start: Coordinate, end: Coordinate): LinearGradientBuilder {
		this.element.x1.baseVal.valueAsString = String(start.x);
		this.element.y1.baseVal.valueAsString = String(start.y);
		this.element.x2.baseVal.valueAsString = String(end.x);
		this.element.y2.baseVal.valueAsString = String(end.y);
		return this;
	}
}