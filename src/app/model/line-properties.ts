import { StrokedElementBuilder } from './svg-builder/stroked-element-builder';

export type LineCap = 'butt' | 'square' | 'round';

export type LineJoin = 'arcs' | 'bevel' | 'round';

export class LinePattern {

	constructor(public array: number[], public width: number) { }

	buildAttributes(builder: StrokedElementBuilder): void {
		builder.setStrokeWidth(this.width);
		if (this.array.length > 0) {
			builder.setStrokeDashArray(this.array.map(it => it * this.width));
		}
	}
}