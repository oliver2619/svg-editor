import { ToggleCommand, Command } from './command';
import { MutableSvgModel } from '../svg-model';
import { EllipseProperties, LineProperties, PolylineProperties, PolygonProperties, RectProperties, CircleProperties, ImageProperties, GroupProperties } from '../model-element-properties';
import { PathProperties } from '../path-properties';

export class SetSizeCommand extends ToggleCommand {

	constructor(private width: number, private height: number) {
		super();
	}

	redo(doc: MutableSvgModel): void {
		const w = doc.width;
		const h = doc.height;
		doc.setSize(this.width, this.height);
		this.width = w;
		this.height = h;
	}
}

export class ChangeDocPropertiesCommand extends ToggleCommand {

	constructor(private title: string) {
		super();
	}

	redo(doc: MutableSvgModel): void {
		const t = doc.title;
		doc.setTitle(this.title);
		this.title = t;
	}
}

export class AddCircleCommand implements Command {

	private readonly properties: CircleProperties;

	constructor(private readonly id: string, properties: CircleProperties, private readonly parentId: string | undefined) {
		this.properties = { ...properties };
	}

	redo(doc: MutableSvgModel) {
		doc.addCircle(this.id, this.properties, this.parentId);
	}

	undo(doc: MutableSvgModel) {
		doc.removeShape(this.id);
	}
}

export class AddEllipseCommand implements Command {

	private readonly properties: EllipseProperties;

	constructor(private readonly id: string, properties: EllipseProperties, private readonly parentId: string | undefined) {
		this.properties = { ...properties };
	}

	redo(doc: MutableSvgModel) {
		doc.addEllipse(this.id, this.properties, this.parentId);
	}

	undo(doc: MutableSvgModel) {
		doc.removeShape(this.id);
	}
}

export class AddGroupCommand implements Command {

	private readonly properties: GroupProperties;

	constructor(private readonly id: string, properties: GroupProperties, private readonly parentId: string | undefined, private readonly zIndex: number | undefined) {
		this.properties = { ...properties };
	}

	redo(doc: MutableSvgModel): void {
		doc.addGroup(this.id, this.properties, this.parentId, this.zIndex);
	}

	undo(doc: MutableSvgModel): void {
		doc.removeShape(this.id);
	}
}

export class AddImageCommand implements Command {

	private readonly properties: ImageProperties;

	constructor(private readonly id: string, properties: ImageProperties, private readonly parentId: string | undefined) {
		this.properties = { ...properties };
	}

	redo(doc: MutableSvgModel) {
		doc.addImage(this.id, this.properties, this.parentId);
	}

	undo(doc: MutableSvgModel) {
		doc.removeShape(this.id);
	}
}

export class AddLineCommand implements Command {

	private readonly properties: LineProperties;

	constructor(private readonly id: string, properties: LineProperties, private readonly parentId: string | undefined) {
		this.properties = { ...properties };
	}

	redo(doc: MutableSvgModel) {
		doc.addLine(this.id, this.properties, this.parentId);
	}

	undo(doc: MutableSvgModel) {
		doc.removeShape(this.id);
	}
}

export class AddPathCommand implements Command {

	private readonly properties: PathProperties;

	constructor(private readonly id: string, properties: PathProperties, private readonly parentId: string | undefined) {
		this.properties = { ...properties, commands: [...properties.commands] };
	}

	redo(doc: MutableSvgModel) {
		doc.addPath(this.id, this.properties, this.parentId);
	}

	undo(doc: MutableSvgModel) {
		doc.removeShape(this.id);
	}
}

export class AddPolylineCommand implements Command {

	private readonly properties: PolylineProperties;

	constructor(private readonly id: string, properties: PolylineProperties, private readonly parentId: string | undefined) {
		this.properties = { ...properties, points: [...properties.points] };
	}

	redo(doc: MutableSvgModel) {
		doc.addPolyline(this.id, this.properties, this.parentId);
	}

	undo(doc: MutableSvgModel) {
		doc.removeShape(this.id);
	}
}

export class AddPolygonCommand implements Command {

	private readonly properties: PolygonProperties;

	constructor(private readonly id: string, properties: PolygonProperties, private readonly parentId: string | undefined) {
		this.properties = { ...properties, points: [...properties.points] };
	}

	redo(doc: MutableSvgModel) {
		doc.addPolygon(this.id, this.properties, this.parentId);
	}

	undo(doc: MutableSvgModel) {
		doc.removeShape(this.id);
	}
}

export class AddRectCommand implements Command {

	private readonly properties: RectProperties;

	constructor(private readonly id: string, properties: RectProperties, private readonly parentId: string | undefined) {
		this.properties = { ...properties };
	}

	redo(doc: MutableSvgModel) {
		doc.addRect(this.id, this.properties, this.parentId);
	}

	undo(doc: MutableSvgModel) {
		doc.removeShape(this.id);
	}
}

export class MoveShapeToGroupCommand extends ToggleCommand {

	constructor(private readonly id: string, private parentId: string | undefined, private zIndex: number | undefined) {
		super();
	}

	redo(doc: MutableSvgModel): void {
		const currentZ = doc.getShapeZIndex(this.id);
		const currentParent = doc.getShapeParent(this.id);
		doc.moveShapeToGroup(this.id, this.parentId, this.zIndex);
		this.parentId = currentParent !== undefined ? currentParent.id : undefined;
		this.zIndex = currentZ;
	}
}

export class MoveShapeZIndexCommand extends ToggleCommand {

	constructor(private readonly id: string, private zIndex: number) {
		super();
	}

	redo(doc: MutableSvgModel): void {
		const currentZ = doc.getShapeZIndex(this.id);
		doc.moveShapeToZIndex(this.id, this.zIndex);
		this.zIndex = currentZ;
	}
}

export class TranslateShapeCommand implements Command {

	private mnemento: any;

	constructor(private readonly id: string, private readonly dx: number, private readonly dy: number) {
	}

	redo(doc: MutableSvgModel): void {
		this.mnemento = doc.getShapeMnemento(this.id);
		doc.translateShape(this.id, this.dx, this.dy);
	}

	undo(doc: MutableSvgModel): void {
		doc.setShapeMnemento(this.id, this.mnemento);
	}
}