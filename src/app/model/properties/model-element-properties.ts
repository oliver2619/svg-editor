import { VectorEffect } from '../vector-effect';
import { Color } from '../color/color';
import { LinePattern, LineCap, LineJoin } from '../line-properties';

export interface ModelElementProperties {
}

export interface ShapeProperties extends ModelElementProperties {
	opacity: number;
	vectorEffect: VectorEffect;
}

export interface BoxProperties extends ShapeProperties{
	x: number;
	y: number;
	width: number;
	height: number;
	rotation: number;
}

export interface StrokeProperties {
	color: Color;
	linePattern: LinePattern;
	lineCap: LineCap;
}

export interface FillProperties {
	color: Color;
}

export interface CircleProperties extends ShapeProperties {
	cx: number;
	cy: number;
	r: number;
	fill: FillProperties;
	stroke: StrokeProperties;
}

export interface EllipseProperties extends ShapeProperties {
	cx: number;
	cy: number;
	rx: number;
	ry: number;
	rotation: number;
	fill: FillProperties;
	stroke: StrokeProperties;
}

export interface GroupProperties extends ShapeProperties {
	fill?: FillProperties;
	stroke?: StrokeProperties;
	lineJoin?: LineJoin;
}

export interface ImageProperties extends BoxProperties {
	url: string;
	preserveAspectRatio: boolean;
}

export interface LineProperties extends ShapeProperties {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	stroke: StrokeProperties;
}

export interface PatternProperties extends ShapeProperties {
	fill: FillProperties;
	stroke: StrokeProperties;
	lineJoin: LineJoin;
}

export interface RectProperties extends BoxProperties {
	rx: number;
	ry: number;
	fill: FillProperties;
	stroke: StrokeProperties;
	lineJoin: LineJoin;
}
