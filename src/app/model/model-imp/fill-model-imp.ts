import { Color } from '../color/color';
import { FilledElementBuilder } from '../svg-builder/filled-element-builder';
import { FillProperties } from '../model-element-properties';

export class FillModelImp {

	color: Color;

	constructor(properties: FillProperties) {
		this.color = properties.color;
	}

	buildAttributes(builder: FilledElementBuilder) {
		this.color.buildFillAttributes(builder);
	}

	getMnemento(): FillProperties {
		return {
			color: this.color
		};
	}
}

