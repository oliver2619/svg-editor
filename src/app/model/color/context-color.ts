import { Color, ColorType, ColorJson } from './color';
import { FilledElementBuilder } from '../svg-builder/filled-element-builder';
import { StrokedElementBuilder } from '../svg-builder/stroked-element-builder';

export class ContextColor implements Color {

	static readonly INSTANCE = new ContextColor();

	readonly type = ColorType.CONTEXT;

	private constructor() { }

	buildStrokeAttributes(builder: StrokedElementBuilder): void {
		builder.setStrokeColor('context-stroke');
	}

	buildFillAttributes(builder: FilledElementBuilder): void {
		builder.setFillColor('context-fill');
	}

	toJson(): ColorJson {
		return {
			type: this.type
		};
	}
}