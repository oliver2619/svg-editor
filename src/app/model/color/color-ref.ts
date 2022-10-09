import { Color, ColorType } from './color';
import { FilledElementBuilder } from '../svg-builder/filled-element-builder';
import { StrokedElementBuilder } from '../svg-builder/stroked-element-builder';

export interface ColorRefJson {

	type: ColorType.LINEAR_GRADIENT | ColorType.RADIAL_GRADIENT | ColorType.PATTERN;

	idRef: string;
}

export abstract class ColorRef implements Color {

	abstract readonly type: ColorType.LINEAR_GRADIENT | ColorType.RADIAL_GRADIENT | ColorType.PATTERN;

	private get url(): string {
		return `url('#${this.idRef}')`;
	}

	constructor(public idRef: string) { }

	buildStrokeAttributes(builder: StrokedElementBuilder): void {
		builder.setStrokeColor(this.url);
	}

	buildFillAttributes(builder: FilledElementBuilder): void {
		builder.setFillColor(this.url);
	}

	toJson(): ColorRefJson {
		return {
			type: this.type,
			idRef: this.idRef
		};
	}
}

export class LinearGradientRef extends ColorRef {

	readonly type = ColorType.LINEAR_GRADIENT;
}

export class RadialGradientRef extends ColorRef {

	readonly type = ColorType.RADIAL_GRADIENT;
}

export class PatternRef extends ColorRef {

	readonly type = ColorType.PATTERN;
}