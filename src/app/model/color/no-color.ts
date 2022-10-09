import { Color, ColorType, ColorJson } from './color';
import { FilledElementBuilder } from '../svg-builder/filled-element-builder';
import { StrokedElementBuilder } from '../svg-builder/stroked-element-builder';

export class NoColor implements Color {

	static readonly INSTANCE = new NoColor();

	private static readonly VALUE = 'none';

	readonly type = ColorType.NONE;

	private constructor() { }

	buildStrokeAttributes(builder: StrokedElementBuilder): void {
		builder.setStrokeColor(NoColor.VALUE);
	}

	buildFillAttributes(builder: FilledElementBuilder): void {
		builder.setFillColor(NoColor.VALUE);
	}

	toJson(): ColorJson {
		return {
			type: this.type
		};
	}
}

