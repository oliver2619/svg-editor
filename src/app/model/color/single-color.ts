import { Color, ColorType, ColorJson } from './color';
import { FilledElementBuilder } from '../svg-builder/filled-element-builder';
import { StrokedElementBuilder } from '../svg-builder/stroked-element-builder';

export interface SingleColorJson extends ColorJson {

	type: ColorType.SINGLE;
	color: string;
	alpha: number;
}

export class SingleColor implements Color {

	readonly type = ColorType.SINGLE;

	get html(): string {
		const r = Math.floor(this.red * 255).toString(16).padStart(2, '0');
		const g = Math.floor(this.green * 255).toString(16).padStart(2, '0');
		const b = Math.floor(this.blue * 255).toString(16).padStart(2, '0');
		return `#${r}${g}${b}`;
	}

	constructor(public red: number, public green: number, public blue: number, public alpha: number) { }

	buildStrokeAttributes(builder: StrokedElementBuilder): void {
		builder.setStrokeColor(this.html);
		builder.setStrokeOpacity(this.alpha);
	}

	buildFillAttributes(builder: FilledElementBuilder): void {
		builder.setFillColor(this.html);
		builder.setFillOpacity(this.alpha);
	}

	toJson(): SingleColorJson {
		return {
			type: ColorType.SINGLE,
			color: this.html,
			alpha: this.alpha
		}
	}

	static fromHexString(s: string): SingleColor {
		const r = Number.parseInt(s.substring(0, 2), 16) / 255;
		const g = Number.parseInt(s.substring(2, 4), 16) / 255;
		const b = Number.parseInt(s.substring(4, 6), 16) / 255;
		return new SingleColor(r, g, b, 1);
	}

	static fromJson(json: SingleColorJson): SingleColor {
		if (json.color[0] === '#') {
			const r = Number.parseInt(json.color.substring(1, 3), 16) / 255;
			const g = Number.parseInt(json.color.substring(3, 5), 16) / 255;
			const b = Number.parseInt(json.color.substring(5, 7), 16) / 255;
			return new SingleColor(r, g, b, json.alpha);
		} else {
			throw new RangeError(`Color ${json.color} not found in mapping`);
		}
	}
}

