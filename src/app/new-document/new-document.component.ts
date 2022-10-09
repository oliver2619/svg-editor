import { ChangeDetectionStrategy, Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModelService } from '../model/model.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SettingsService } from '../settings/settings.service';

interface NewDocumentComponentValue {
	title: string;
	width: number;
	height: number;
	preset: string;
}

@Component({
	selector: 'se-new-document',
	templateUrl: './new-document.component.html',
	styleUrls: ['./new-document.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewDocumentComponent implements AfterViewInit {

	@ViewChild('focus')
	private focus: ElementRef<HTMLInputElement> | undefined;

	readonly formGroup: FormGroup;

	get okEnabled(): () => boolean { return () => this.formGroup.valid; }

	private get value(): NewDocumentComponentValue { return this.formGroup.value; }

	constructor(private modelService: ModelService, private readonly settingsService: SettingsService, private router: Router, formBuilder: FormBuilder) {
		const size = this.settingsService.newImageSize;
		this.formGroup = formBuilder.group({});
		this.formGroup.addControl('title', formBuilder.control(''));
		this.formGroup.addControl('width', formBuilder.control(size.x, [Validators.min(1), Validators.required]));
		this.formGroup.addControl('height', formBuilder.control(size.y, [Validators.min(1), Validators.required]));
		this.formGroup.addControl('preset', formBuilder.control(''));
	}

	ngAfterViewInit(): void {
		if (this.focus !== undefined) {
			this.focus.nativeElement.focus();
		}
	}

	ok(): void {
		const val = this.value;
		this.settingsService.merge(settings => {
			settings.newImage.width = val.width;
			settings.newImage.height = val.height;
		});
		this.modelService.newDocument(val.width, val.height, val.title);
		this.router.navigateByUrl('/');
	}

	cancel(): void {
		this.router.navigateByUrl('/');
	}

	onSizeChange() {
		const v = this.value;
		v.preset = `${v.width}x${v.height}`;		
		this.formGroup.setValue(v, { emitEvent: false });
	}

	onPresetChange() {
		const v = this.value;
		const newSize = v.preset.split('x').map(v => Number.parseInt(v));
		v.width = newSize[0];
		v.height = newSize[1];
		this.formGroup.setValue(v, { emitEvent: false, });
	}
}
