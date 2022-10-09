import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModelService } from '../model/model.service';
import { Router } from '@angular/router';
import { DialogAction } from '../shared/dialog/dialog.component';
import { TextService } from '../shared/text/text.service';

interface DownloadComponentValue {
	source: string;
}

@Component({
	selector: 'se-download',
	templateUrl: './download.component.html',
	styleUrls: ['./download.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DownloadComponent implements OnInit {

	@ViewChild('fileDownload')
	private fileDownload: ElementRef<HTMLAnchorElement> | undefined;

	readonly additionalButtons: DialogAction[] = [{
		action: () => this.copyToClipbard(),
		name: this.textService.get('document.download.copyToClipboard')
	}];

	readonly formGroup: FormGroup;

	get okEnabled(): () => boolean { return () => this.formGroup.valid; }

	private get value(): DownloadComponentValue {
		return this.formGroup.value;
	}

	constructor(private readonly router: Router, private readonly modelService: ModelService, private readonly textService: TextService, formBuilder: FormBuilder) {
		this.formGroup = formBuilder.group({});
		this.formGroup.addControl('source', formBuilder.control('', Validators.required));
	}

	ngOnInit(): void {
		const value: DownloadComponentValue = {
			source: this.modelService.exportSvg()
		};
		this.formGroup.setValue(value);
	}

	cancel() {
		this.router.navigateByUrl('/');
	}

	download() {
		if (this.fileDownload !== undefined) {
			const a = this.fileDownload.nativeElement;
			const source = this.value.source;
			a.href = `data:image/svg+xml;base64,${btoa(source)}`;
			if (this.modelService.title.length > 0) {
				a.download = `${encodeURIComponent(this.modelService.title)}.svg`;
			} else {
				a.download = 'download.svg';
			}
			a.click();
			this.router.navigateByUrl('/');
		}
	}

	private copyToClipbard() {
		navigator.clipboard.writeText(this.value.source);
	}
}
