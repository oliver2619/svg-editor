import { PathProperties } from "../properties/path-properties";
import { CircleProperties, EllipseProperties, GroupProperties, ImageProperties, LineProperties, RectProperties } from "../properties/model-element-properties";
import { ImportBuilder, ImportContainerBuilder, ImportContentBuilder } from "./import-builder";
import { SvgModelImp } from "../model-imp/model-imp";

export class SvgModelImportBuilder implements ImportBuilder {

	private model: SvgModelImp | undefined;

	getModel(): SvgModelImp {
		if (this.model === undefined) {
			throw new Error('Model is not yet builded');
		}
		return this.model;
	}

	newDocument(width: number, height: number): ImportContentBuilder {
		this.model = new SvgModelImp(width, height);
		return new SvgModelContentImportBuilder(this.model);
	}
}

class SvgModelContentImportBuilder implements ImportContentBuilder {

	private readonly container: SvgContainerImportBuilder

	get nextId(): string { return this.container.nextId; }

	constructor(private readonly model: SvgModelImp) {
		this.container = new SvgContainerImportBuilder(model, undefined);
	}

	title(title: string): void {
		this.model.setTitle(title);
	}

	rect(id: string, properties: RectProperties): void {
		this.container.rect(id, properties);
	}

	path(id: string, properties: PathProperties): void {
		this.container.path(id, properties);
	}

	line(id: string, properties: LineProperties): void {
		this.container.line(id, properties);
	}

	image(id: string, properties: ImageProperties): void {
		this.container.image(id, properties);
	}

	group(id: string, properties: GroupProperties): ImportContainerBuilder {
		return this.container.group(id, properties);
	}

	ellipse(id: string, properties: EllipseProperties): void {
		this.container.ellipse(id, properties);
	}

	circle(id: string, properties: CircleProperties): void {
		this.container.circle(id, properties);
	}
}

class SvgContainerImportBuilder implements ImportContainerBuilder {

	get nextId(): string { return this.model.nextId; }

	constructor(private readonly model: SvgModelImp, private readonly parent: string | undefined) { }

	rect(id: string, properties: RectProperties): void {
		this.model.addRect(id, properties, this.parent, undefined);
	}

	path(id: string, properties: PathProperties): void {
		this.model.addPath(id, properties, this.parent, undefined);
	}

	line(id: string, properties: LineProperties): void {
		this.model.addLine(id, properties, this.parent, undefined);
	}

	image(id: string, properties: ImageProperties): void {
		this.model.addImage(id, properties, this.parent, undefined);
	}

	group(id: string, properties: GroupProperties): ImportContainerBuilder {
		this.model.addGroup(id, properties, this.parent, undefined);
		return new SvgContainerImportBuilder(this.model, id);
	}

	ellipse(id: string, properties: EllipseProperties): void {
		this.model.addEllipse(id, properties, this.parent, undefined);
	}

	circle(id: string, properties: CircleProperties): void {
		this.model.addCircle(id, properties, this.parent, undefined);
	}
}