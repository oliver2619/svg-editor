import { ModelElement } from "../model-element";
import { DefsBuilder } from "../svg-builder/defs-builder";
import { GradientBuilder } from "../svg-builder/gradient-builder";
import { ColorStop, ColorStopProperties } from "./color-stop";

export type SpreadMethod = 'pad' | 'reflect' | 'repeat';

export interface GradientProperties {
    readonly id: string;
    spreadMethod?: SpreadMethod;
    userSpaceOnUse?: boolean;
    stops: ColorStopProperties[];
}

export abstract class Gradient implements ModelElement<DefsBuilder>{

    readonly id: string;

    private spreadMethod: SpreadMethod;
    private userSpaceOnUse: boolean;
    private stops: ColorStop[];

    constructor(properties: GradientProperties) {
        this.id = properties.id;
        this.spreadMethod = properties.spreadMethod ?? 'pad';
        this.userSpaceOnUse = properties.userSpaceOnUse ?? false;
        this.stops = properties.stops.map(s => new ColorStop(s));
    }

    abstract buildSvg(builder: DefsBuilder): void;

    protected buildColorStops(builder: GradientBuilder) {
        this.stops.forEach(s => s.build(builder));
    }

    protected buildProperties(builder: GradientBuilder) {
        builder.setSpreadMethod(this.spreadMethod);
        builder.setUserSpaceOnUse(this.userSpaceOnUse);
    }
}