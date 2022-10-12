import { ChangeDetectionStrategy, Component, ViewContainerRef, ComponentRef, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { AbstractDrawTool } from '../tool';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GroupBuilder } from 'src/app/model/svg-builder/group-builder';
import { ViewService } from 'src/app/view/view.service';
import { ImageBuilder } from 'src/app/model/svg-builder/image-builder';

export class ImageTool extends AbstractDrawTool {

	private readonly group: GroupBuilder;
	private image: ImageBuilder | undefined;
	private component: ImageComponent | undefined;

	constructor(viewService: ViewService) {
		super(viewService);
		this.group = viewService.toolGroupBuilder;
	}

	cleanUp() {
		if (this.image !== undefined) {
			this.group.clearShapes();
			this.image = undefined;
		}
	}

	createPropertiesComponent(container: ViewContainerRef): ComponentRef<any> | undefined {
		const ret = container.createComponent(ImageComponent);
		this.component = ret.instance;
		return ret;
	}

	protected onComplete(startX: number, startY: number, targetX: number, targetY: number): void {
		if (this.image !== undefined && this.component !== undefined) {
			this.viewService.addImage({
				x: Math.min(startX, targetX),
				y: Math.min(startY, targetY),
				width: Math.abs(targetX - startX),
				height: Math.abs(targetY - startY),
				rotation: 0,
				url: this.component.imageUrl,
				opacity: this.component.opacity,
				vectorEffect: 'none',
				preserveAspectRatio: this.component.preserveAspectRatio
			});
		}
		this.cleanUp();
	}

	protected onDraw(startX: number, startY: number, targetX: number, targetY: number): void {
		if (this.image !== undefined) {
			this.image.setRect(Math.min(startX, targetX), Math.min(startY, targetY), Math.abs(targetX - startX), Math.abs(targetY - startY));
		}
	}

	protected onStart(x: number, y: number): void {
		if (this.component !== undefined && this.component.hasImage) {
			this.image = this.group.image(this.component.imageUrl, x, y, 0, 0);
			this.image.preserveAspectRatio(this.component.preserveAspectRatio);
			this.image.setOpacity(this.component.opacity);
		}
	}

	protected override queryAspect(): number { return this.component !== undefined ? this.component.aspect : 1; }
}

interface ImageComponentValue {
	embedded: boolean;
	name: string;
	width: number;
	height: number;
	url: string;
	opacity: number;
	preserveAspectRatio: boolean;
}

@Component({
	selector: 'se-image',
	templateUrl: './image.component.html',
	styleUrls: ['./image.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageComponent {

	@ViewChild('fileUpload')
	private fileUpload: ElementRef<HTMLInputElement> | undefined;

	readonly formGroup: FormGroup;

	get aspect(): number {
		const v = this.value;
		return v.height !== 0 ? v.width / v.height : 1;
	}

	get imageUrl(): string {
		return this.value.url;
	}

	get height(): number {
		return this.value.height;
	}

	get width(): number {
		return this.value.width;
	}

	get hasImage(): boolean {
		return this.imageUrl !== '';
	}

	get opacity(): number {
		return this.value.opacity / 100;
	}

	get preserveAspectRatio(): boolean {
		return this.value.preserveAspectRatio;
	}

	private get value(): ImageComponentValue {
		return this.formGroup.value;
	}

	constructor(private readonly changeDetector: ChangeDetectorRef, formBuilder: FormBuilder) {
		this.formGroup = formBuilder.group({});
		this.formGroup.addControl('embedded', formBuilder.control(true, []));
		this.formGroup.addControl('name', formBuilder.control('', [Validators.required]));
		this.formGroup.addControl('width', formBuilder.control(0, [Validators.required]));
		this.formGroup.addControl('height', formBuilder.control(0, [Validators.required]));
		this.formGroup.addControl('url', formBuilder.control('', [Validators.required]));
		this.formGroup.addControl('opacity', formBuilder.control(100, [Validators.required]));
		this.formGroup.addControl('preserveAspectRatio', formBuilder.control(false, []));
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

	upload() {
		if (this.fileUpload !== undefined) {
			this.fileUpload.nativeElement.click();
		}
	}

	private setImage(dataUrl: string, name: string) {
		const v: ImageComponentValue = this.formGroup.value;
		v.name = name;
		v.url = dataUrl;
		const image = new Image();
		image.src = dataUrl;
		image.onload = () => {
			v.width = image.width;
			v.height = image.height;
			this.formGroup.setValue(v);
			this.changeDetector.markForCheck();
		}
	}
}
