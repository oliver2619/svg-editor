import { ChangeDetectionStrategy, Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModelService } from '../model/model.service';

interface ImageResizeComponentValue {
	width: number;
	height: number;
}

@Component({
	selector: 'se-image-resize',
	templateUrl: './image-resize.component.html',
	styleUrls: ['./image-resize.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageResizeComponent implements AfterViewInit {

	@ViewChild('focus')
	private focus: ElementRef<HTMLInputElement> | undefined;

	readonly formGroup: FormGroup;

	get okEnabled(): () => boolean {
		return () => this.formGroup.valid;
	}

	private get value(): ImageResizeComponentValue {
		return this.formGroup.value;
	}

	constructor(private readonly router: Router, private readonly modelService: ModelService, formBuilder: FormBuilder) {
		this.formGroup = formBuilder.group({});
		this.formGroup.addControl('width', formBuilder.control(modelService.width, [Validators.min(1), Validators.required]));
		this.formGroup.addControl('height', formBuilder.control(modelService.height, [Validators.min(1), Validators.required]));
	}

	ngAfterViewInit(): void {
		if (this.focus !== undefined) {
			this.focus.nativeElement.focus();
		}
	}

	cancel() {
		this.router.navigateByUrl('/');
	}

	ok() {
		const val = this.value;
		this.modelService.setSize(val.width, val.height);
		this.router.navigateByUrl('/');
	}
}
