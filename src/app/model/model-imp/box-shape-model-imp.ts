import { Coordinate } from "../coordinate";
import { BoxProperties } from "../properties/model-element-properties";
import { BoxBuilder } from "../svg-builder/box-builder";
import { ShapeModelImp } from "./shape-model-imp";

export abstract class BoxShapeModelImp extends ShapeModelImp {

    protected x: number;
    protected y: number;
    protected width: number;
    protected height: number;
    protected rotation: number;

    constructor(id: string, parentId: string | undefined, properties: BoxProperties) {
        super(id, parentId, properties);
        this.x = properties.x;
        this.y = properties.y;
        this.width = properties.width;
        this.height = properties.height;
        this.rotation = properties.rotation;
    }

    flipH(px: number): void {
        this.rotation = -this.rotation;

    }

    flipV(py: number): void {
        this.rotation = -this.rotation;

    }

    override getMnemento(): BoxProperties {
        return {
            ...super.getMnemento(),
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            rotation: this.rotation
        };
    }

    rotate(deg: number, px: number, py: number) {
        this.rotation += deg;
        const c = new Coordinate(this.x, this.y);
        c.rotate(deg, px, py);
        this.x = c.x;
        this.y = c.y;
    }

    scale(sx: number, sy: number, px: number, py: number): void {
        const c = new Coordinate(this.x, this.y);
        c.scale(sx, sy, px, py);
        this.x = c.x;
        this.y = c.y;
        const f = Math.sqrt(Math.abs(sx * sy));
        this.width *= f;
        this.height *= f;
    }

    override setMnemento(m: BoxProperties) {
        this.x = m.x;
        this.y = m.y;
        this.width = m.width;
        this.height = m.height;
        this.rotation = m.rotation;
    }

    translate(dx: number, dy: number) {
        this.x += dx;
        this.y += dy;
    }

    protected buildBoxAttributes(builder: BoxBuilder<any>) {
        builder.setRotation(this.rotation, this.x, this.y);
    }
}