import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ChangeDetectorRef, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

export interface ImagePreviewComponentEvent {
	name: string;
	url: string;
	image: HTMLImageElement;
}

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

	@Output('upload-image')
	readonly onUploadImage = new EventEmitter<ImagePreviewComponentEvent>();

	@ViewChild('fileUpload')
	private fileUpload: ElementRef<HTMLInputElement> | undefined;
	
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

	upload() {
		if (this.fileUpload !== undefined) {
			this.fileUpload.nativeElement.click();
		}
	}

	onInput() {
		const files: FileList | null = (this.fileUpload as ElementRef<HTMLInputElement>).nativeElement.files;
		if (files !== null && files.length === 1) {
			const file = files[0];
			const reader = new FileReader();
			reader.onload = ev => {
				this.setImage(reader.result as string, file.name);
			};
			reader.readAsDataURL(file)
		}
	}

	private setImage(dataUrl: string, name: string) {
		const image = new Image();
		image.src = dataUrl;
		image.onload = () => {
			this.onUploadImage.emit({
				image,
				name,
				url: dataUrl
			});
		};
	}

	private updateSize(image: HTMLImageElement) {
		const max = Math.max(image.width, image.height);
		const scale = max > ImagePreviewComponent.MAX_SIZE ? ImagePreviewComponent.MAX_SIZE / max : 1;
		this.width = image.width * scale;
		this.height = image.height * scale;
		this.changeDetector.markForCheck();
	}
}
