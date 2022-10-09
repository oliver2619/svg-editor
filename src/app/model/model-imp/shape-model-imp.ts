import { VectorEffect } from '../vector-effect';
import { ShapeContainerBuilder } from '../svg-builder/shape-container-builder';
import { ShapeBuilder } from '../svg-builder/shape-builder';
import { ShapeProperties } from '../model-element-properties';
import { ShapeModel, ShapeModelType } from '../shape-model';

export abstract class ShapeModelImp implements ShapeModel {

	abstract readonly type: ShapeModelType;

	private _opacity: number;
	private _vectorEffect: VectorEffect;

	get opacity(): number { return this._opacity; }

	get vectorEffect(): VectorEffect { return this._vectorEffect; }

	constructor(readonly id: string, public parentId: string | undefined, properties: ShapeProperties) {
		this._opacity = properties.opacity;
		this._vectorEffect = properties.vectorEffect;
	}

	abstract buildSvg(builder: ShapeContainerBuilder): void;

	getMnemento(): ShapeProperties {
		return {
			opacity: this._opacity,
			vectorEffect: this._vectorEffect
		};
	}

	getTransformableShapes(): string[] {
		return [this.id];
	}

	setMnemento(m: ShapeProperties) {
		this._opacity = m.opacity;
		this._vectorEffect = m.vectorEffect;
	}
	
	abstract translate(dx: number, dy: number): void;

	protected buildShapeAttributes(builder: ShapeBuilder<SVGElement>) {
		builder.setId(this.id);
		builder.setOpacity(this._opacity);
		builder.setVectorEffect(this._vectorEffect);
	}
}
