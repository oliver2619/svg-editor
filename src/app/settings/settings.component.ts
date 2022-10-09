import { ChangeDetectionStrategy, Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModelService } from '../model/model.service';
import { SettingsService } from './settings.service';

interface SettingsComponentValue {
	undoSize: number | null;
	uiSize: string;
}

@Component({
	selector: 'se-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements AfterViewInit {

	@ViewChild('focus')
	focus: ElementRef<HTMLInputElement> | undefined;

	readonly formGroup: FormGroup;

	get okEnabled(): () => boolean { return () => this.formGroup.valid; }

	private get value(): SettingsComponentValue { return this.formGroup.value; }

	constructor(private readonly router: Router, private readonly modelService: ModelService, private readonly settingsService: SettingsService, formBuilder: FormBuilder) {
		this.formGroup = formBuilder.group({});
		this.formGroup.addControl('undoSize', formBuilder.control(modelService.maxUndoHistorySize !== undefined ? modelService.maxUndoHistorySize : null, [Validators.min(1)]));
		this.formGroup.addControl('uiSize', formBuilder.control(settingsService.uiSize, [Validators.required]));
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
		const v = this.value;
		this.modelService.maxUndoHistorySize = v.undoSize !== null ? v.undoSize : undefined;
		this.settingsService.merge(json => {
			json.view.uiSize = v.uiSize;
		});
		this.router.navigateByUrl('/');
	}
}
