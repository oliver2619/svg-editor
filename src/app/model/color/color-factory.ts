import { ColorJson, Color, ColorType } from './color';
import { ContextColor } from './context-color';
import { NoColor } from './no-color';
import { SingleColor, SingleColorJson } from './single-color';
import { RadialGradientRef, ColorRefJson, PatternRef, LinearGradientRef } from './color-ref';

export class ColorFactory {

	static fromJson(json: ColorJson): Color {
		switch (json.type) {
			case ColorType.CONTEXT:
				return ContextColor.INSTANCE;
			case ColorType.LINEAR_GRADIENT:
				return new LinearGradientRef((json as ColorRefJson).idRef);
			case ColorType.NONE:
				return NoColor.INSTANCE;
			case ColorType.PATTERN:
				return new PatternRef((json as ColorRefJson).idRef);
			case ColorType.RADIAL_GRADIENT:
				return new RadialGradientRef((json as ColorRefJson).idRef);
			case ColorType.SINGLE:
				return SingleColor.fromJson(json as SingleColorJson);
			default:
				throw new RangeError(`Illegal color type ${json.type} in json`);
		}
	}
}