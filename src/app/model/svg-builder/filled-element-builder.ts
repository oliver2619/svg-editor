import { FillProperties } from "../properties/model-element-properties";

export interface FilledElementBuilder {

	setFillColor(color: string): void;

	setFillOpacity(opacity: number): void;

	setFillProperties(properties: FillProperties): void;

}

export class FilledElementBuilderImp implements FilledElementBuilder {

	constructor(private readonly element: SVGElement) { }

	setFillColor(color: string) {
		this.element.setAttribute('fill', color);
	}

	setFillOpacity(opacity: number) {
		if (opacity !== 1) {
			this.element.setAttribute('fill-opacity', String(opacity));
		} else {
			this.element.removeAttribute('fill-opacity');
		}
	}

	setFillProperties(properties: FillProperties): void {
		properties.color.buildFillAttributes(this);
	}
}