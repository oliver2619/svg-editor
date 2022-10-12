import { SvgBuilder } from './svg-builder/svg-builder';
import { CircleProperties, EllipseProperties, GroupProperties, LineProperties, PatternProperties, PolylineProperties, PolygonProperties, RectProperties, ImageProperties, ShapeProperties } from './model-element-properties';
import { ShapeModel, GroupModel } from './shape-model';
import { PathProperties } from './path-properties';

export interface SvgModel {

	readonly width: number;
	readonly height: number;
	readonly title: string;

	createSvg(builder: SvgBuilder): void;

	exportSvg(): string;

	getAllTransformableShapes(): string[];

	getGroups(id: string): string[];

	getShapeById(id: string): ShapeModel;

	getShapeMnemento(id: string): ShapeProperties;

	getShapeNestingDepth(id: string): number;

	getShapeParent(id: string): GroupModel | undefined;

	getShapeRootParent(id: string): GroupModel | undefined;

	getShapeMaxZIndex(id: string): number;

	getShapeZIndex(id: string): number;

	getTopLevelShapes(): ShapeModel[];

	getTopLevelShapeIds(): string[];

	getTransformableShapes(shapeIds: string[]): string[];

	hasShape(id: string): boolean;

	isGroup(id: string): boolean;
}

export interface MutableSvgModel extends SvgModel {

	addCircle(id: string, properties: CircleProperties, parent: string | undefined, zIndex: number | undefined): void;

	addEllipse(id: string, properties: EllipseProperties, parent: string | undefined, zIndex: number | undefined): void;

	addGroup(id: string, properties: GroupProperties, parent: string | undefined, zIndex: number | undefined): void;

	addLine(id: string, properties: LineProperties, parent: string | undefined, zIndex: number | undefined): void;

	addCircularGradient(): void;

	addFilter(): void;

	addImage(id: string, properties: ImageProperties, parent: string | undefined, zIndex: number | undefined): void;

	addLinearGradient(): void;

	addMarker(): void;

	addPath(id: string, properties: PathProperties, parent: string | undefined, zIndex: number | undefined): void;

	addPattern(id: string, properties: PatternProperties): void;

	addPolyline(id: string, properties: PolylineProperties, parent: string | undefined, zIndex: number | undefined): void;

	addPolygon(id: string, properties: PolygonProperties, parent: string | undefined, zIndex: number | undefined): void;

	addRect(id: string, properties: RectProperties, parent: string | undefined, zIndex: number | undefined): void;

	flipShapeH(id: string, px: number): void;

	flipShapeV(id: string, py: number): void;

	moveShapeToGroup(shapeId: string, parent: string | undefined, zIndex: number | undefined): void;

	moveShapeToZIndex(shapeId: string, zIndex: number): void;

	removeFilter(id: string): void;

	removeGradient(id: string): void;

	removeMarker(id: string): void;

	removePattern(id: string): void;

	removeShape(id: string): void;

	rotateShape(id: string, deg: number, px: number, py: number): void;

	scaleShape(id: string, sx: number, sy: number, px: number, py: number): void;

	setShapeMnemento(id: string, m: any): void;

	setSize(width: number, height: number): void;

	setTitle(title: string): void;

	translateShape(id: string, dx: number, dy: number): void;
}
