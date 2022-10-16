import { ShapeBuilder } from "./shape-builder";

export interface BoxBuilder<E extends SVGElement> extends ShapeBuilder<E> {

    setRect(x: number, y: number, width: number, height: number): void;

    setRotation(deg: number, px: number, py: number): void;
}