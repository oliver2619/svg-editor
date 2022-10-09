import { SvgImporter } from './importer/svg-importer';
import { StrokedElementBuilder } from './svg-builder/stroked-element-builder';

export type LineCap = 'butt' | 'square' | 'round';

export type LineJoin = 'arcs' | 'bevel' | 'round';

export class LinePattern {

	constructor(public array: number[], public width: number) { }

	buildAttributes(builder: StrokedElementBuilder): void {
		builder.setStrokeWidth(this.width);
		if (this.array.length > 0) {
			builder.setStrokeDashArray(this.array.map(it => it * this.width));
		}
	}

	static importFromSvg(element: SVGElement): LinePattern {
		const strokeDashArrayValue = SvgImporter.getInheritedAttribute(element, 'stroke-dasharray');
		const strokeDashArray = strokeDashArrayValue !== undefined ? strokeDashArrayValue.split(',').map(it => Number.parseFloat(it.trim())) : [];
		const strokeWidthValue = SvgImporter.getInheritedAttribute(element, 'stroke-width');
		const strokeWidth = strokeWidthValue !== undefined ? Number.parseFloat(strokeWidthValue) : 1;
		return new LinePattern(strokeDashArray, strokeWidth);
	}
}