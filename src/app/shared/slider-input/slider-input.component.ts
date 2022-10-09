import { Subscription } from 'rxjs';
import { ChangeDetectionStrategy, Component, OnInit, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormControl, FormBuilder } from '@angular/forms';

@Component({
	selector: 'se-slider-input',
	templateUrl: './slider-input.component.html',
	styleUrls: ['./slider-input.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SliderInputComponent implements OnInit, OnDestroy {

	@Input('unit')
	unit = '';

	@Input('control')
	controlInput: AbstractControl<number> | undefined;

	@Input('min')
	min = 0;

	@Input('max')
	max = 100;

	private controlSubscription: Subscription | undefined;

	control2: FormControl;

	get control(): FormControl<number> {
		return this.controlInput as FormControl<number>;
	}

	constructor(formBuilder: FormBuilder) {
		this.control2 = formBuilder.control(0);
	}

	ngOnInit(): void {
		let lock = false;
		if (this.controlInput !== undefined) {
			this.controlSubscription = this.controlInput.valueChanges.subscribe({
				next: (v: number) => {
					if (!lock) {
						lock = true;
						this.control2.setValue(v);
						lock = false;
					}
				}
			});
			this.control2.setValue(this.controlInput.value);
			this.control2.valueChanges.subscribe({
				next: (v: number) => {
					if (!lock) {
						lock = true;
						(this.controlInput as AbstractControl<number>).setValue(v);
						lock = false;
					}
				}
			});
		}
	}

	ngOnDestroy(): void {
		if (this.controlSubscription !== undefined) {
			this.controlSubscription.unsubscribe();
		}
	}
}
