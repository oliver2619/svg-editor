import { ChangeDetectionStrategy, Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ModelService } from '../model/model.service';

interface DocumentPropertiesValue {
	title: string;
}

@Component({
	selector: 'se-document-properties',
	templateUrl: './document-properties.component.html',
	styleUrls: ['./document-properties.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentPropertiesComponent implements AfterViewInit {

	@ViewChild('focus')
	focus: ElementRef<HTMLInputElement> | undefined;

	readonly formGroup: FormGroup;

	get okEnabled(): () => boolean { return () => this.formGroup.valid; }

	constructor(private readonly router: Router, private readonly modelService: ModelService, formBuilder: FormBuilder) {
		this.formGroup = formBuilder.group({});
		this.formGroup.addControl('title', formBuilder.control(this.modelService.title));
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
		const value = <DocumentPropertiesValue>this.formGroup.value;
		this.modelService.setTitle(value.title);
		this.router.navigateByUrl('/');
	}
}
