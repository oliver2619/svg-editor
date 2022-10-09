export interface FilledElementBuilder {

	setFillColor(color: string): void;

	setFillOpacity(opacity: number): void;
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
}