import { LineCap, LineJoin } from '../line-properties';
import { StrokeProperties } from '../properties/model-element-properties';

export interface StrokedElementBuilder {

	setLineCap(cap: LineCap): void;

	setLineJoin(join: LineJoin): void;

	setStrokeColor(color: string): void;

	setStrokeDashArray(array: number[]): void;

	setStrokeOpacity(opacity: number): void;

	setStrokeProperties(properties: StrokeProperties): void;

	setStrokeWidth(width: number): void;
}

export class StrokedElementBuilderImp implements StrokedElementBuilder {

	constructor(private readonly element: SVGElement) { }

	setLineCap(cap: LineCap) {
		if (cap !== 'butt') {
			this.element.setAttribute('stroke-linecap', cap);
		} else {
			this.element.removeAttribute('stroke-linecap');
		}
	}

	setLineJoin(join: LineJoin) { this.element.setAttribute('stroke-linejoin', join); }

	setStrokeColor(color: string) { this.element.setAttribute('stroke', color); }

	setStrokeDashArray(array: number[]) {
		if (array.length > 0) {
			this.element.setAttribute('stroke-dasharray', array.join(','));
		} else {
			this.element.removeAttribute('stroke-dasharray');
		}
	}

	setStrokeOpacity(opacity: number) {
		if (opacity !== 1) {
			this.element.setAttribute('stroke-opacity', String(opacity));
		} else {
			this.element.removeAttribute('stroke-opacity');
		}
	}

	setStrokeProperties(properties: StrokeProperties): void {
		properties.color.buildStrokeAttributes(this);
		properties.linePattern.buildAttributes(this);
	}

	setStrokeWidth(width: number) {
		if (width !== 1) {
			this.element.setAttribute('stroke-width', String(width));
		} else {
			this.element.removeAttribute('stroke-width');
		}
	}
}