import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';

@Component({
	selector: 'se-image-preview',
	templateUrl: './image-preview.component.html',
	styleUrls: ['./image-preview.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImagePreviewComponent implements OnChanges {

	static readonly MAX_SIZE = 128;

	@Input('src')
	imageUrl: string = '';

	width: number = 0;
	height: number = 0;

	get hasImage(): boolean {
		return this.imageUrl !== '';
	}

	constructor(private readonly changeDetector: ChangeDetectorRef) { }

	ngOnChanges(changes: SimpleChanges): void {
		if (this.imageUrl !== undefined) {
			const image = new Image();
			image.src = this.imageUrl;
			image.onload = () => {
				this.updateSize(image);
			}
		}
	}

	private updateSize(image: HTMLImageElement) {
		const max = Math.max(image.width, image.height);
		const scale = max > ImagePreviewComponent.MAX_SIZE ? ImagePreviewComponent.MAX_SIZE / max : 1;
		this.width = image.width * scale;
		this.height = image.height * scale;
		this.changeDetector.markForCheck();
	}
}
