import { GradientBuilder } from '../svg-builder/gradient-builder';
import { SingleColor } from './single-color';

export interface ColorStopProperties {
	offset: number;
	color: SingleColor;
}

export class ColorStop {

	public offset: number;
	public color: SingleColor;

	constructor(properties: ColorStopProperties) {
		this.offset = properties.offset;
		this.color = properties.color;
	}

	build(builder: GradientBuilder) {
		builder.addColorStop(this.offset, this.color.html, this.color.alpha);
	}
}