import { Color } from '../color/color';
import { LinePattern } from '../line-properties';
import { StrokedElementBuilder } from '../svg-builder/stroked-element-builder';
import { StrokeProperties } from '../model-element-properties';

export class StrokeModelImp {

	color: Color;
	linePattern: LinePattern;

	constructor(properties: StrokeProperties) {
		this.color = properties.color;
		this.linePattern = properties.linePattern;
	}

	buildAttributes(builder: StrokedElementBuilder) {
		this.color.buildStrokeAttributes(builder);
		this.linePattern.buildAttributes(builder);
	}

	getMnemento(): StrokeProperties {
		return {
			color: this.color,
			linePattern: this.linePattern
		}
	}
}

