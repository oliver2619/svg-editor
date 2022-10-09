import { VectorEffect } from './vector-effect';
import { Color } from './color/color';
import { LinePattern, LineCap, LineJoin } from './line-properties';
import { Coordinate } from './coordinate';

export interface ModelElementProperties {
}

export interface ShapeProperties extends ModelElementProperties {
	opacity: number;
	vectorEffect: VectorEffect;
}

export interface StrokeProperties {
	color: Color;
	linePattern: LinePattern;
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
	fill: FillProperties;
	stroke: StrokeProperties;
}

export interface GroupProperties extends ShapeProperties {
	fill?: FillProperties;
	stroke?: StrokeProperties;
	lineCap?: LineCap;
	lineJoin?: LineJoin;
}

export interface ImageProperties extends ShapeProperties {
	x: number;
	y: number;
	width: number;
	height: number;
	url: string;
	preserveAspectRatio: boolean;
}

export interface LineProperties extends ShapeProperties {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	stroke: StrokeProperties;
	lineCap: LineCap;
}

export interface PatternProperties extends ShapeProperties {
	fill: FillProperties;
	stroke: StrokeProperties;
	lineCap: LineCap;
	lineJoin: LineJoin;
}

export interface PolylineProperties extends ShapeProperties {
	fill: FillProperties;
	stroke: StrokeProperties;
	points: ReadonlyArray<Coordinate>;
	lineCap: LineCap;
	lineJoin: LineJoin;
}

export interface PolygonProperties extends ShapeProperties {
	fill: FillProperties;
	stroke: StrokeProperties;
	points: ReadonlyArray<Coordinate>;
	lineJoin: LineJoin;
}

export interface RectProperties extends ShapeProperties {
	x: number;
	y: number;
	width: number;
	height: number;
	rx: number;
	ry: number;
	fill: FillProperties;
	stroke: StrokeProperties;
	lineJoin: LineJoin;
}
