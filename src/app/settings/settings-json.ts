import { LineJoin, LineCap } from '../model/line-properties';
import { VectorEffect } from '../model/vector-effect';
import { ColorJson } from '../model/color/color';

export interface NewImageSettingsJson {

	width: number;

	height: number;
}

export interface GridSettingsJson {

	visible: boolean;

	size: number;

	snap: boolean;
}

export interface ShapeSettingsJson {

	fill: ColorJson;

	dashArray: number[];

	lineCap: LineCap;

	lineJoin: LineJoin;

	opacity: number;

	stroke: ColorJson;

	strokeWidth: number;

	vectorEffect: VectorEffect;
}

export interface ToolsSettingsJson {

	currentTool: string;

	currentShape: ShapeSettingsJson;

	toolData: { [key: string]: any };
}

export interface ViewSettingsJson {

	rulers: boolean;

	uiSize: string;

	wireframe: boolean;
}

export interface GlobalSettingsJson {

	undoHistorySize: number | undefined;
}

export interface SettingsJson {

	version: 1;

	tools: ToolsSettingsJson;

	newImage: NewImageSettingsJson;

	grid: GridSettingsJson;

	view: ViewSettingsJson;

	global: GlobalSettingsJson;
}