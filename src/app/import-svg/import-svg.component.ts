import { ChangeDetectionStrategy, Component, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ModelService } from '../model/model.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TextService } from '../shared/text/text.service';
import { Router } from '@angular/router';
import { DialogAction } from '../shared/dialog/dialog.component';

interface ImportSvgComponentValue {
	source: string;
	filename: string;
}

@Component({
	selector: 'se-import-svg',
	templateUrl: './import-svg.component.html',
	styleUrls: ['./import-svg.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportSvgComponent {

	@ViewChild('fileUpload')
	private fileUpload: ElementRef<HTMLInputElement> | undefined;

	readonly formGroup: FormGroup;
	readonly additionalButtons: DialogAction[] = [{
		name: this.textService.get('upload'),
		action: () => this.upload()
	}];

	get okEnabled(): () => boolean { return () => this.formGroup.valid; }

	private get value(): ImportSvgComponentValue {
		return this.formGroup.value;
	}

	constructor(private readonly router: Router, private readonly modelService: ModelService, private readonly textService: TextService, private readonly changeDetectorRef: ChangeDetectorRef, formBuilder: FormBuilder) {
		this.formGroup = formBuilder.group({});
		this.formGroup.addControl('filename', formBuilder.control(''));
		this.formGroup.addControl('source', formBuilder.control('', Validators.required));
	}

	cancel() {
		this.router.navigateByUrl('/');
	}

	importSvg(): void {
		const value = this.value;
		this.modelService.importSvg(value.source, value.filename);
		this.router.navigateByUrl('/');
	}

	onInputSvg(): void {
		const files: FileList | null = (this.fileUpload as ElementRef<HTMLInputElement>).nativeElement.files;
		if (files !== null && files.length === 1) {
			const file = files[0];
			file.text().then(svg => this.setSvg(svg, file.name));
		}
	}

	private setSvg(source: string, filename: string) {
		const value: ImportSvgComponentValue = {
			filename,
			source
		};
		this.formGroup.setValue(value);
		this.changeDetectorRef.markForCheck();
	}

	private upload() {
		if (this.fileUpload !== undefined) {
			this.fileUpload.nativeElement.click();
		}
	}

}
