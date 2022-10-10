import { ModelElement } from './model-element';
import { ShapeProperties } from './model-element-properties';
import { ShapeContainerBuilder } from './svg-builder/shape-container-builder';

export enum ShapeModelType {
	CIRCLE, ELLIPSE, GROUP, IMAGE, LINE, PATH, POLYGON, POLYLINE, RECT
}

export interface ShapeModel extends ModelElement<ShapeContainerBuilder> {

	readonly parentId: string | undefined;

	readonly type: ShapeModelType;
	
	getMnemento(): ShapeProperties;
}

export interface GroupModel extends ShapeModel {

	readonly size: number;

	getShapeZIndex(id: string): number;

	getTopLevelShapes(): ShapeModel[];
}