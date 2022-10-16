import { LineCap, LineJoin } from "../model/line-properties";
import { FillProperties, ShapeProperties, StrokeProperties } from "../model/properties/model-element-properties";

export interface ShapePropertiesComponentInterface {
	
    readonly fillProperties: FillProperties;

    readonly shapeProperties: ShapeProperties;

    readonly strokeProperties: StrokeProperties;

    readonly lineJoin: LineJoin;
}

