import { Subscription } from 'rxjs';
import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl, FormBuilder } from '@angular/forms';

@Component({
	selector: 'se-slider-input',
	templateUrl: './slider-input.component.html',
	styleUrls: ['./slider-input.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SliderInputComponent implements OnChanges {

	@Input('unit')
	unit = '';

	@Input('control')
	numberControl: AbstractControl<number> | undefined;

	@Input('min')
	min = 0;

	@Input('max')
	max = 100;

	@Output('value-change')
	onValueChange = new EventEmitter<number>();

	@Output('value-changing')
	onValueChanging = new EventEmitter<number>();

	private controlSubscription: Subscription | undefined;

	sliderControl: FormControl<number>;

	get control(): FormControl<number> {
		return this.numberControl as FormControl<number>;
	}

	constructor(formBuilder: FormBuilder) {
		this.sliderControl = formBuilder.control(0) as FormControl<number>;
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (this.controlSubscription === undefined && this.numberControl !== undefined) {
			this.numberControl.valueChanges.subscribe({
				next: () => {
					this.sliderControl.setValue(this.numberControl!.value);
				}
			});
		}
		this.sliderControl.setValue(this.numberControl!.value);
	}

	ngOnDestroy(): void {
		if (this.controlSubscription !== undefined) {
			this.controlSubscription.unsubscribe();
		}
	}

	onInputChange(e: HTMLInputElement) {
		const v = Number(e.value);
		this.onValueChange.emit(v);
	}

	onSliderChange(e: HTMLInputElement) {
		const v = Number(e.value);
		this.numberControl!.setValue(v);
		this.onValueChange.emit(v);
	}

	onSliderInput(e: HTMLInputElement) {
		const v = Number(e.value);
		this.numberControl!.setValue(v);
		this.onValueChanging.emit(v);
	}
}
