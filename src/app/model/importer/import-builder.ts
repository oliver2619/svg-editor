import { CircleProperties, EllipseProperties, GroupProperties, ImageProperties, LineProperties, PolygonProperties, PolylineProperties, RectProperties } from "../model-element-properties";
import { PathProperties } from "../path-properties";

export interface ImportContainerBuilder {

	readonly nextId: string;

	circle(id: string, properties: CircleProperties): void;

	ellipse(id: string, properties: EllipseProperties): void;

	group(id: string, properties: GroupProperties): ImportContainerBuilder;

	image(id: string, properties: ImageProperties): void;

	line(id: string, properties: LineProperties): void;

	path(id: string, properties: PathProperties): void;

	polygon(id: string, properties: PolygonProperties): void;

	polyline(id: string, properties: PolylineProperties): void;

	rect(id: string, properties: RectProperties): void;
}

export interface ImportContentBuilder extends ImportContainerBuilder {

	title(title: string): void;
}

export interface ImportBuilder {

	newDocument(width: number, height: number): ImportContentBuilder;
}
