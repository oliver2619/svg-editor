import { StrokedElementBuilder } from '../svg-builder/stroked-element-builder';
import { FilledElementBuilder } from '../svg-builder/filled-element-builder';

export enum ColorType {
	NONE, CONTEXT, SINGLE, LINEAR_GRADIENT, RADIAL_GRADIENT, PATTERN
}

export interface ColorJson {
	
	type: ColorType;
}

export interface Color {
	
	readonly type: ColorType;

	buildFillAttributes(builder: FilledElementBuilder): void;

	buildStrokeAttributes(builder: StrokedElementBuilder): void;
	
	toJson(): ColorJson;
}