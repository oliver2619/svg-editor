export interface SvgElementBuilder<E extends SVGElement> {

	readonly element: E;

	setAttribute(name: string, value: any): void;

	setClass(cssClass: string): void;

	setId(id: string): void;
}

export class SvgElementBuilderImp implements SvgElementBuilder<SVGElement> {

	constructor(readonly element: SVGElement) { }

	setAttribute(name: string, value: any) { this.element.setAttribute(name, String(value)); }

	setClass(cssClass: string) { this.element.classList.add(cssClass); }

	setId(id: string) { this.element.id = id; }
}

