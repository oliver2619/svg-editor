import { GroupBuilder } from '../model/svg-builder/group-builder';

export class TransformToolHelper {

	private selectionGroup: GroupBuilder | undefined;

	constructor(private readonly group: GroupBuilder) {	}

	beginTransform(ids: string[]) {
		const svg = (this.group.element.ownerSVGElement as SVGSVGElement);
		this.selectionGroup = this.group.group();
		const el = ids.map(id => svg.getElementById(id) as SVGElement);
		el.forEach(e => (this.selectionGroup as GroupBuilder).element.appendChild(e));
	}

	end() {
		this.group.clearShapes();
		this.selectionGroup = undefined;
	}
}