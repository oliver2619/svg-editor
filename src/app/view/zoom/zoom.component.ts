import { Subscription } from 'rxjs';
import { ChangeDetectionStrategy, Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ViewService } from '../../view/view.service';
import { View } from '../../view/view';

interface ZoomComponentValue {
	zoom: string;
}

@Component({
	selector: 'se-zoom',
	templateUrl: './zoom.component.html',
	styleUrls: ['./zoom.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZoomComponent implements OnDestroy {

	readonly formGroup: FormGroup;
	readonly predefinedZoomValues = Object.freeze([10, 4, 2, 1, 0.5, 0.25, 0.1]);

	private readonly viewSubscription: Subscription | undefined;

	get currentZoomValue(): string { return String(Math.floor(this.viewService.zoom * 1000) / 10); }

	get isCustom(): boolean { return this.predefinedZoomValues.indexOf(this.viewService.zoom) < 0; }

	private get value(): ZoomComponentValue { return this.formGroup.value; }

	constructor(private readonly viewService: ViewService, private readonly changeDetectorRef: ChangeDetectorRef, formBuilder: FormBuilder) {
		this.formGroup = formBuilder.group({});
		const zoom: FormControl<string | null> = formBuilder.control('1');
		this.formGroup.addControl('zoom', zoom);
		this.viewSubscription = viewService.onViewChange.subscribe({
			next: (view: View) => {
				const val = this.value;
				if (this.predefinedZoomValues.indexOf(view.zoom) >= 0) {
					val.zoom = String(view.zoom);
				} else {
					val.zoom = 'custom';
				}
				this.formGroup.setValue(val);
				this.changeDetectorRef.markForCheck();
			}
		});
	}

	ngOnDestroy(): void {
		if (this.viewSubscription !== undefined) {
			this.viewSubscription.unsubscribe();
		}
	}

	onChange() {
		const zoom = this.value.zoom;
		switch (zoom) {
			case 'canvas':
				this.viewService.zoomToFitCanvas();
				break;
			case 'selection':
				this.viewService.zoomToFitSelection();
				break;
			case 'content':
				this.viewService.zoomToFitContent();
				break;
			case 'custom':
				break;
			default:
				this.viewService.setZoom(Number.parseFloat(zoom));
		}
		const v = this.value;
		switch (v.zoom) {
			case 'canvas':
			case 'selection':
			case 'content':
				v.zoom = 'custom';
				this.formGroup.setValue(v);
		}
	}
}
