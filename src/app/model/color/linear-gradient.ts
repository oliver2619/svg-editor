import { ColorStop } from './color-stop';
import { Coordinate } from '../coordinate';
import { ModelElement } from '../model-element';
import { DefsBuilder } from '../svg-builder/defs-builder';

export type SpreadMethod = 'pad' | 'reflect' | 'repeat';

export class LinearGradient implements ModelElement<DefsBuilder> {

	private stops: ColorStop[] = [];

	constructor(readonly id: string, public spreadMethod: SpreadMethod, public start: Coordinate, public end: Coordinate) { }

	buildSvg(builder: DefsBuilder): void {
		const gradient = builder.linearGradient(this.id);
		gradient.setPath(this.start, this.end);
		gradient.setSpreadMethod(this.spreadMethod);
		this.stops.forEach(s => gradient.addColorStop(s.offset, s.color.html, s.color.alpha));
	}
}