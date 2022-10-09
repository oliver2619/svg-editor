import { ShapeModelImp } from './shape-model-imp';
import { ShapeModelType } from '../shape-model';
import { ShapeContainerBuilder } from '../svg-builder/shape-container-builder';
import { ImageProperties } from '../model-element-properties';

export class ImageModelImp extends ShapeModelImp {

	readonly type = ShapeModelType.IMAGE;

	private x: number;
	private y: number;
	private width: number;
	private height: number;
	private url: string;
	private preserveAspectRatio: boolean;

	constructor(id: string, parentId: string | undefined, properties: ImageProperties) {
		super(id, parentId, properties);
		this.x = properties.x;
		this.y = properties.y;
		this.width = properties.width;
		this.height = properties.height;
		this.url = properties.url;
		this.preserveAspectRatio = properties.preserveAspectRatio;
	}

	buildSvg(builder: ShapeContainerBuilder): void {
		const image = builder.image(this.url, this.x, this.y, this.width, this.height);
		image.preserveAspectRatio(this.preserveAspectRatio);
		this.buildShapeAttributes(image);
	}
	
	override getMnemento(): ImageProperties {
		return {
			...super.getMnemento(),
			x: this.x,
			y: this.y,
			width: this.width,
			height: this.height,
			url: this.url,
			preserveAspectRatio: this.preserveAspectRatio
		};
	}

	override setMnemento(m: ImageProperties) {
		super.setMnemento(m);
		this.x = m.x;
		this.y = m.y;
		this.width = m.width;
		this.height = m.height;
		this.url = m.url;
		this.preserveAspectRatio = m.preserveAspectRatio;
	}

	translate(dx: number, dy: number) {
		this.x += dx;
		this.y += dy;
	}
}