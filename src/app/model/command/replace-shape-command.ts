import { CircleProperties, EllipseProperties, LineProperties, RectProperties, ShapeProperties } from "../properties/model-element-properties";
import { PathProperties } from "../properties/path-properties";
import { ShapeModelType } from "../shape-model";
import { MutableSvgModel } from "../svg-model";
import { ToggleCommand } from "./command";

export class ReplaceShapeCommand extends ToggleCommand {

	constructor(private readonly id: string, private shapeType: ShapeModelType, private properties: ShapeProperties) {
		super();
	}

	redo(doc: MutableSvgModel): void {
		const shape = doc.getShapeById(this.id);
		const type = shape.type;
		const properties = shape.getMnemento();
		switch (this.shapeType) {
			case ShapeModelType.CIRCLE:
				doc.replaceShapeWithCircle(this.id, this.properties as CircleProperties);
				break;
			case ShapeModelType.ELLIPSE:
				doc.replaceShapeWithEllipse(this.id, this.properties as EllipseProperties);
				break;
			case ShapeModelType.GROUP:
				throw new Error('Conversion to group not allowed');
			case ShapeModelType.IMAGE:
				throw new Error('Conversion to image not allowed');
			case ShapeModelType.LINE:
				doc.replaceShapeWithLine(this.id, this.properties as LineProperties);
				break;
			case ShapeModelType.PATH:
				doc.replaceShapeWithPath(this.id, this.properties as PathProperties);
				break;
			case ShapeModelType.RECT:
				doc.replaceShapeWithRect(this.id, this.properties as RectProperties);
		}
		this.properties = properties;
		this.shapeType = type;
	}
}

