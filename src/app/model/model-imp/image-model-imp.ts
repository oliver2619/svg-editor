import { ShapeModelType } from '../shape-model';
import { ShapeContainerBuilder } from '../svg-builder/shape-container-builder';
import { ImageProperties } from '../model-element-properties';
import { BoxShapeModelImp } from './box-shape-model-imp';

export class ImageModelImp extends BoxShapeModelImp {

	readonly type = ShapeModelType.IMAGE;

	private url: string;
	private preserveAspectRatio: boolean;

	constructor(id: string, parentId: string | undefined, properties: ImageProperties) {
		super(id, parentId, properties);
		this.url = properties.url;
		this.preserveAspectRatio = properties.preserveAspectRatio;
	}

	buildSvg(builder: ShapeContainerBuilder): void {
		const image = builder.image(this.url, this.x, this.y, this.width, this.height);
		image.preserveAspectRatio(this.preserveAspectRatio);
		image.setRotation(this.rotation, this.x, this.y);
		this.buildShapeAttributes(image);
	}
	
	override getMnemento(): ImageProperties {
		return {
			...super.getMnemento(),
			url: this.url,
			preserveAspectRatio: this.preserveAspectRatio
		};
	}

	override setMnemento(m: ImageProperties) {
		super.setMnemento(m);
		this.url = m.url;
		this.preserveAspectRatio = m.preserveAspectRatio;
	}
}