import { ChangeDetectionStrategy, Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ViewService } from '../view/view.service';

interface GridsizeComponentValue {
	size: number;
}

@Component({
	selector: 'se-gridsize',
	templateUrl: './gridsize.component.html',
	styleUrls: ['./gridsize.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridsizeComponent implements AfterViewInit {

	@ViewChild('focus')
	private focus: ElementRef<HTMLInputElement> | undefined;

	readonly formGroup: FormGroup;

	get okEnabled(): () => boolean {
		return () => this.formGroup.valid;
	}

	private get value(): GridsizeComponentValue {
		return this.formGroup.value;
	}

	constructor(private readonly router: Router, private readonly viewService: ViewService, formBuilder: FormBuilder) {
		this.formGroup = formBuilder.group({});
		this.formGroup.addControl('size', formBuilder.control(this.viewService.gridSize, [Validators.min(1), Validators.required]));
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
		this.viewService.gridSize = this.value.size;
		this.router.navigateByUrl('/');
	}
}
