import { ChangeDetectionStrategy, Component, ViewContainerRef, ComponentRef, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { AbstractDrawTool } from '../tool';
import { ViewService } from 'src/app/view/view.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModelService } from 'src/app/model/model.service';
import { RectBuilder } from 'src/app/model/svg-builder/rect-builder';
import { GroupBuilder } from 'src/app/model/svg-builder/group-builder';

export class CropTool extends AbstractDrawTool {

	private readonly groupBuilder: GroupBuilder;
	private component: CropComponent | undefined;
	private rectangleBuilder: RectBuilder | undefined;

	constructor(viewService: ViewService) {
		super(viewService);
		this.groupBuilder = viewService.toolGroupBuilder;
	}

	cleanUp() {
		if (this.rectangleBuilder !== undefined) {
			this.groupBuilder.clearShapes();
			this.rectangleBuilder = undefined;
		}
	}

	createPropertiesComponent(container: ViewContainerRef): ComponentRef<any> | undefined {
		const ret = container.createComponent(CropComponent);
		this.component = ret.instance;
		this.component.onChange.subscribe({
			next: (value: CropComponentValue) => {
				this.updateRect(value);
			}
		});
		return ret;
	}

	protected onComplete(startX: number, startY: number, targetX: number, targetY: number): void {
	}

	protected onDraw(startX: number, startY: number, targetX: number, targetY: number): void {
		if (this.component !== undefined) {
			this.component.setValue({
				x1: Math.min(startX, targetX),
				y1: Math.min(startY, targetY),
				x2: Math.max(startX, targetX),
				y2: Math.max(startY, targetY)
			});
		}
	}

	protected onStart(x: number, y: number): void {
		this.groupBuilder.clearShapes();
		this.rectangleBuilder = undefined;
		if (this.component !== undefined) {
			this.component.setValue({
				x1: x,
				y1: y,
				x2: x,
				y2: y
			});
		}
	}

	private updateRect(value: CropComponentValue) {
		if (this.rectangleBuilder === undefined) {
			this.groupBuilder.clearShapes();
			this.rectangleBuilder = this.groupBuilder.rect(value.x1, value.y1, value.x2 - value.x1, value.y2 - value.y1);
			this.rectangleBuilder.setClass('selection');
		} else {
			this.rectangleBuilder.setRect(value.x1, value.y1, value.x2 - value.x1, value.y2 - value.y1);
		}
	}
}

interface CropComponentValue {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
}

@Component({
	selector: 'se-crop',
	templateUrl: './crop.component.html',
	styleUrls: ['./crop.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CropComponent {

	readonly formGroup: FormGroup;
	readonly onChange = new EventEmitter<CropComponentValue>();

	get height(): number {
		const val = <CropComponentValue>this.formGroup.value;
		return Math.round((val.y2 - val.y1 + 1) * 10) / 10;
	}

	get width(): number {
		const val = <CropComponentValue>this.formGroup.value;
		return Math.round((val.x2 - val.x1 + 1) * 10) / 10;
	}

	get canCrop(): boolean {
		return this.formGroup.valid;
	}

	constructor(private readonly changeDetectorRef: ChangeDetectorRef, private readonly modelService: ModelService, formBuilder: FormBuilder) {
		this.formGroup = formBuilder.group({});
		this.formGroup.addControl('x1', formBuilder.control(0, [Validators.required]));
		this.formGroup.addControl('y1', formBuilder.control(0, [Validators.required]));
		this.formGroup.addControl('x2', formBuilder.control(modelService.width, [Validators.required]));
		this.formGroup.addControl('y2', formBuilder.control(modelService.height, [Validators.required]));
		this.formGroup.addValidators(ctrl => {
			const val = <CropComponentValue>ctrl.value;
			if (val.x1 > val.x2) {
				return {
					error: 'Width is negative'
				};
			}
			if (val.y1 > val.y2) {
				return {
					error: 'Height is negative'
				};
			}
			return null;
		});
		this.formGroup.valueChanges.subscribe({ next: (value: CropComponentValue) => this.onChange.emit(value) })
	}

	crop() {
		const val = <CropComponentValue>this.formGroup.value;
		this.modelService.cropImage(Math.round(val.x1 as number), Math.round(val.y1 as number), Math.round(this.width), Math.round(this.height));
		val.x1 = 0;
		val.y1 = 0;
		val.x2 = this.modelService.width;
		val.y2 = this.modelService.height;
		this.formGroup.setValue(val);
	}

	setValue(value: CropComponentValue) {
		const v: CropComponentValue = {
			x1: Math.round(value.x1 * 10) / 10,
			y1: Math.round(value.y1 * 10) / 10,
			x2: Math.round(value.x2 * 10) / 10,
			y2: Math.round(value.y2 * 10) / 10,
		}
		this.formGroup.setValue(v);
		this.changeDetectorRef.markForCheck();
	}
}
