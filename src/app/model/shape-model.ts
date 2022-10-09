import { ModelElement } from './model-element';
import { ShapeContainerBuilder } from './svg-builder/shape-container-builder';

export enum ShapeModelType {
	CIRCLE, ELLIPSE, GROUP, IMAGE, LINE, PATH, POLYGON, POLYLINE, RECT
}

export interface ShapeModel extends ModelElement<ShapeContainerBuilder> {

	readonly parentId: string | undefined;

	readonly type: ShapeModelType;
}

export interface GroupModel extends ShapeModel {

	readonly size: number;

	getShapeZIndex(id: string): number;

	getTopLevelShapes(): ShapeModel[];
}