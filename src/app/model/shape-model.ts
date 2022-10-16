import { ComponentRef, ViewContainerRef } from '@angular/core';
import { ModelElement } from './model-element';
import { ShapeProperties } from './properties/model-element-properties';
import { PathProperties } from './properties/path-properties';
import { ShapeContainerBuilder } from './svg-builder/shape-container-builder';
import { MutableSvgModel } from './svg-model';

export enum ShapeModelType {
	CIRCLE, ELLIPSE, GROUP, IMAGE, LINE, PATH, RECT
}

export interface ShapeModel extends ModelElement<ShapeContainerBuilder> {

	readonly parentId: string | undefined;
	readonly type: ShapeModelType;
	readonly canConvertToPath: boolean;

	createPropertiesComponent(container: ViewContainerRef, model: MutableSvgModel): ComponentRef<any>;

	getConvertToPathProperties(): PathProperties;

	getMnemento(): ShapeProperties;
}

export interface GroupModel extends ShapeModel {

	readonly size: number;

	getShapeZIndex(id: string): number;

	getTopLevelShapes(): ShapeModel[];
}