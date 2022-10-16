import { Color } from '../color/color';
import { LineCap, LinePattern } from '../line-properties';
import { StrokedElementBuilder } from '../svg-builder/stroked-element-builder';
import { StrokeProperties } from '../properties/model-element-properties';

export class StrokeModelImp {

	color: Color;
	linePattern: LinePattern;
	lineCap: LineCap;

	constructor(properties: StrokeProperties) {
		this.color = properties.color;
		this.linePattern = properties.linePattern;
		this.lineCap = properties.lineCap;
	}

	buildAttributes(builder: StrokedElementBuilder) {
		this.color.buildStrokeAttributes(builder);
		this.linePattern.buildAttributes(builder);
		builder.setLineCap(this.lineCap);
	}

	getMnemento(): StrokeProperties {
		return {
			color: this.color,
			linePattern: this.linePattern,
			lineCap: this.lineCap
		}
	}
}

