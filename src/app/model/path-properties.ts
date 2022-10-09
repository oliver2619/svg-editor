import { ShapeProperties, FillProperties, StrokeProperties } from './model-element-properties';
import { LineCap, LineJoin } from './line-properties';

export interface PathCmdProperties {
	cmd: 'M' | 'H' | 'V' | 'L' | 'C' | 'S' | 'Q' | 'T' | 'Z';
}

export interface PathCmdMoveProperties extends PathCmdProperties {
	cmd: 'M';
	x: number;
	y: number;
}

export interface PathCmdHLineProperties extends PathCmdProperties {
	cmd: 'H';
	x: number;
}

export interface PathCmdVLineProperties extends PathCmdProperties {
	cmd: 'V';
	y: number;
}

export interface PathCmdLineToProperties extends PathCmdProperties {
	cmd: 'L';
	x: number;
	y: number;
}

export interface PathCmdBezierCurveToProperties extends PathCmdProperties {
	cmd: 'C';
	hx1: number;
	hy1: number;
	hx2: number;
	hy2: number;
	x: number;
	y: number;
}

export interface PathCmdContinueBezierCurveToProperties extends PathCmdProperties {
	cmd: 'S';
	hx: number;
	hy: number;
	x: number;
	y: number;
}

export interface PathCmdQuadCurveToProperties extends PathCmdProperties {
	cmd: 'Q';
	hx: number;
	hy: number;
	x: number;
	y: number;
}

export interface PathCmdContinueQuadCurveToProperties extends PathCmdProperties {
	cmd: 'T';
	x: number;
	y: number;
}

export interface PathCmdCloseProperties extends PathCmdProperties {
	cmd: 'Z';
}

export interface PathProperties extends ShapeProperties {
	fill: FillProperties;
	stroke: StrokeProperties;
	lineCap: LineCap;
	lineJoin: LineJoin;
	commands: ReadonlyArray<PathCmdProperties>;
}
