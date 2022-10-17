import { ShapeModelType } from '../shape-model';
import { ShapeContainerBuilder } from '../svg-builder/shape-container-builder';
import { ImageProperties } from '../properties/model-element-properties';
import { BoxShapeModelImp } from './box-shape-model-imp';
import { PathProperties } from '../properties/path-properties';
import { ComponentRef, ViewContainerRef } from '@angular/core';
import { MutableSvgModel } from '../svg-model';
import { SelectedImagePropertiesComponent } from 'src/app/selection-properties/selected-image-properties/selected-image-properties.component';

export class ImageModelImp extends BoxShapeModelImp {

	readonly canConvertToPath = false;
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
		this.buildShapeAttributes(image);
		this.buildBoxAttributes(image);
	}

	createPropertiesComponent(container: ViewContainerRef, model: MutableSvgModel): ComponentRef<any> {
		const ret = container.createComponent(SelectedImagePropertiesComponent);
		ret.instance.properties = this.getMnemento();
		ret.instance.onImageChange.subscribe({
			next: (img: ImageProperties) => {
				model.setShapeMnemento(this.id, img);
			}
		});
		return ret;
	}

	getConvertToPathProperties(): PathProperties {
		throw new Error('Image can\'t be converted to a path');
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