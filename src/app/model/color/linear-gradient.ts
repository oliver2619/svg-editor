import { Coordinate } from '../coordinate';
import { DefsBuilder } from '../svg-builder/defs-builder';
import { Gradient, GradientProperties } from './gradient';

export interface LinearGradientProperties extends GradientProperties {
	start: Coordinate;
	end: Coordinate;
}

export class LinearGradient extends Gradient {


	constructor(properties: LinearGradientProperties, public start: Coordinate, public end: Coordinate) {
		super(properties);
	}

	buildSvg(builder: DefsBuilder): void {
		const gradient = builder.linearGradient(this.id);
		gradient.setPath(this.start, this.end);
		this.buildProperties(gradient);
		this.buildColorStops(gradient);
	}
}