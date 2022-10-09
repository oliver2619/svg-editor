import { ChangeDetectionStrategy, Component, ViewChild, ElementRef, AfterViewInit, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SingleColor } from 'src/app/model/color/single-color';
import { FilledElementBuilderImp } from 'src/app/model/svg-builder/filled-element-builder';

interface ColorComponentValue {
	red: number;
	green: number;
	blue: number;
	alpha: number;
	hue: number;
	saturation: number;
	brightness: number;
	mode: string;
	html: string;
}

@Component({
	selector: 'se-color',
	templateUrl: './color.component.html',
	styleUrls: ['./color.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColorComponent implements AfterViewInit, OnChanges {

	@ViewChild('svgRect')
	svg: ElementRef<SVGRectElement> | undefined;

	@ViewChild('svgOldRect')
	oldSvg: ElementRef<SVGRectElement> | undefined;

	@Input('color')
	initialColor: SingleColor | undefined;

	@Output('color-change')
	onColorChange = new EventEmitter<SingleColor>();

	readonly drawXYRed = (x: number, y: number, rgba: number[]) => {
		rgba[0] = this._red;
		rgba[1] = x;
		rgba[2] = y;
		rgba[3] = this.alpha;
	};

	readonly drawXYGreen = (x: number, y: number, rgba: number[]) => {
		rgba[0] = x;
		rgba[1] = this._green;
		rgba[2] = y;
		rgba[3] = this.alpha;
	};

	readonly drawXYBlue = (x: number, y: number, rgba: number[]) => {
		rgba[0] = x;
		rgba[1] = y;
		rgba[2] = this._blue;
		rgba[3] = this.alpha;
	};

	readonly drawXYHue = (x: number, y: number, rgba: number[]) => {
		const rgb = this.hsvToRgb(this._hue, x, y);
		rgba[0] = rgb[0];
		rgba[1] = rgb[1];
		rgba[2] = rgb[2];
		rgba[3] = this.alpha;
	};

	readonly drawXYSaturation = (x: number, y: number, rgba: number[]) => {
		const rgb = this.hsvToRgb(x * 6, this._saturation, y);
		rgba[0] = rgb[0];
		rgba[1] = rgb[1];
		rgba[2] = rgb[2];
		rgba[3] = this.alpha;
	};

	readonly drawXYBrightness = (x: number, y: number, rgba: number[]) => {
		const rgb = this.hsvToRgb(x * 6, y, this._brightness);
		rgba[0] = rgb[0];
		rgba[1] = rgb[1];
		rgba[2] = rgb[2];
		rgba[3] = this.alpha;
	};

	get drawXY(): (x: number, y: number, rgba: number[]) => void {
		const v: ColorComponentValue = this.formGroup.value;
		switch (v.mode) {
			case 'red':
				return this.drawXYRed;
			case 'green':
				return this.drawXYGreen;
			case 'blue':
				return this.drawXYBlue;
			case 'hue':
			default:
				return this.drawXYHue;
			case 'saturation':
				return this.drawXYSaturation;
			case 'brightness':
				return this.drawXYBrightness;
		}
	}

	get hasInitialColor(): boolean {
		return this.initialColor !== undefined;
	}

	readonly drawR = (x: number, y: number, rgba: number[]) => {
		rgba[0] = x;
		rgba[1] = this._green;
		rgba[2] = this._blue;
		rgba[3] = this.alpha;
	};

	readonly drawG = (x: number, y: number, rgba: number[]) => {
		rgba[0] = this._red;
		rgba[1] = x;
		rgba[2] = this._blue;
		rgba[3] = this.alpha;
	};

	readonly drawB = (x: number, y: number, rgba: number[]) => {
		rgba[0] = this._red;
		rgba[1] = this._green;
		rgba[2] = x;
		rgba[3] = this.alpha;
	};

	readonly drawH = (x: number, y: number, rgba: number[]) => {
		const rgb = this.hsvToRgb(x * 6, this._saturation, this._brightness);
		rgba[0] = rgb[0];
		rgba[1] = rgb[1];
		rgba[2] = rgb[2];
		rgba[3] = this.alpha;
	};

	readonly drawS = (x: number, y: number, rgba: number[]) => {
		const rgb = this.hsvToRgb(this._hue, x, this._brightness);
		rgba[0] = rgb[0];
		rgba[1] = rgb[1];
		rgba[2] = rgb[2];
		rgba[3] = this.alpha;
	};

	readonly drawV = (x: number, y: number, rgba: number[]) => {
		const rgb = this.hsvToRgb(this._hue, this._saturation, x);
		rgba[0] = rgb[0];
		rgba[1] = rgb[1];
		rgba[2] = rgb[2];
		rgba[3] = this.alpha;
	};

	readonly drawA = (x: number, y: number, rgba: number[]) => {
		rgba[0] = this._red;
		rgba[1] = this._green;
		rgba[2] = this._blue;
		rgba[3] = x;
	};

	readonly formGroup: FormGroup;

	alpha = 1;
	version = 0;

	private _red = 0;
	private _green = 0;
	private _blue = 0;
	private _hue = 0;
	private _saturation = 0;
	private _brightness = 0;

	get x(): number {
		const v: ColorComponentValue = this.formGroup.value;
		switch (v.mode) {
			case 'red':
				return this._green;
			case 'green':
				return this._red;
			case 'blue':
				return this._red;
			case 'hue':
			default:
				return this._saturation;
			case 'saturation':
				return this._hue / 6;
			case 'brightness':
				return this._hue / 6;
		}
	}

	get y(): number {
		const v: ColorComponentValue = this.formGroup.value;
		switch (v.mode) {
			case 'red':
				return this._blue;
			case 'green':
				return this._blue;
			case 'blue':
				return this._green;
			case 'hue':
			default:
				return this._brightness;
			case 'saturation':
				return this._brightness;
			case 'brightness':
				return this._saturation;
		}
	}

	get red(): number { return this._red }

	get green(): number { return this._green; }

	get blue(): number { return this._blue; }

	get hue(): number { return this._hue; }

	get saturation(): number { return this._saturation; }

	get brightness(): number { return this._brightness; }

	get html(): string {
		const r = Math.floor(this._red * 255).toString(16).padStart(2, '0');
		const g = Math.floor(this._green * 255).toString(16).padStart(2, '0');
		const b = Math.floor(this._blue * 255).toString(16).padStart(2, '0');
		return `${r}${g}${b}`;
	}

	constructor(formBuilder: FormBuilder) {
		this.setHSV();
		this.formGroup = formBuilder.group({});
		this.formGroup.addControl('red', formBuilder.control(this._red * 100, [Validators.required, Validators.min(0), Validators.max(100)]));
		this.formGroup.addControl('green', formBuilder.control(this._green * 100, [Validators.required, Validators.min(0), Validators.max(100)]));
		this.formGroup.addControl('blue', formBuilder.control(this._blue * 100, [Validators.required, Validators.min(0), Validators.max(100)]));
		this.formGroup.addControl('alpha', formBuilder.control(this.alpha * 100, [Validators.required, Validators.min(0), Validators.max(100)]));
		this.formGroup.addControl('hue', formBuilder.control(this._hue * 60, [Validators.required, Validators.min(0), Validators.max(100)]));
		this.formGroup.addControl('saturation', formBuilder.control(this._saturation * 100, [Validators.required, Validators.min(0), Validators.max(100)]));
		this.formGroup.addControl('brightness', formBuilder.control(this._brightness * 100, [Validators.required, Validators.min(0), Validators.max(100)]));
		this.formGroup.addControl('mode', formBuilder.control('hue'));
		this.formGroup.addControl('html', formBuilder.control(this.html, Validators.required));
	}

	ngAfterViewInit(): void {
		this.updateSvg();
		this.updateOldSvg();
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.updateOldSvg();
		if (this.initialColor !== undefined) {
			this._red = this.initialColor.red;
			this._green = this.initialColor.green;
			this._blue = this.initialColor.blue;
			this.alpha = this.initialColor.alpha;
		} else {
			this._red = 1;
			this._green = 1;
			this._blue = 1;
			this.alpha = 1;
		}
		this.setHSV();
		++this.version;
		this.updateSvg();
		this.updateForm();
	}

	onChangeXY(ev: number[]) {
		const v: ColorComponentValue = this.formGroup.value;
		switch (v.mode) {
			case 'red':
				this._green = ev[0];
				this._blue = ev[1];
				this.setHSV();
				break;
			case 'green':
				this._red = ev[0];
				this._blue = ev[1];
				this.setHSV();
				break;
			case 'blue':
				this._red = ev[0];
				this._green = ev[1];
				this.setHSV();
				break;
			case 'hue':
			default:
				this._saturation = ev[0];
				this._brightness = ev[1];
				this.setRGB();
				break;
			case 'saturation':
				this._hue = ev[0] * 6;
				this._brightness = ev[1];
				this.setRGB();
				break;
			case 'brightness':
				this._hue = ev[0] * 6;
				this._saturation = ev[1];
				this.setRGB();
				break;
		}
		++this.version;
		this.updateSvg();
		this.updateForm();
		this.notifyColorChange();
	}

	onChangeR(ev: number[]) {
		this._red = ev[0];
		this.setHSV();
		++this.version;
		this.updateSvg();
		this.updateForm();
		this.notifyColorChange();
	}

	onChangeG(ev: number[]) {
		this._green = ev[0];
		this.setHSV();
		++this.version;
		this.updateSvg();
		this.updateForm();
		this.notifyColorChange();
	}

	onChangeB(ev: number[]) {
		this._blue = ev[0];
		this.setHSV();
		++this.version;
		this.updateSvg();
		this.updateForm();
		this.notifyColorChange();
	}

	onChangeA(ev: number[]) {
		this.alpha = ev[0];
		++this.version;
		this.updateSvg();
		this.updateForm();
		this.notifyColorChange();
	}

	onChangeH(ev: number[]) {
		this._hue = ev[0] * 6;
		this.setRGB();
		++this.version;
		this.updateSvg();
		this.updateForm();
		this.notifyColorChange();
	}

	onChangeS(ev: number[]) {
		this._saturation = ev[0];
		this.setRGB();
		++this.version;
		this.updateSvg();
		this.updateForm();
		this.notifyColorChange();
	}

	onChangeV(ev: number[]) {
		this._brightness = ev[0];
		this.setRGB();
		++this.version;
		this.updateSvg();
		this.updateForm();
		this.notifyColorChange();
	}

	onInputR(ev: Event) {
		const v = Math.max(0, Math.min(1, Number.parseInt((<HTMLInputElement>ev.target).value) / 100));
		if (isNaN(v)) {
			this.updateForm();
			return;
		}
		this._red = v;
		this.setHSV();
		++this.version;
		this.updateSvg();
		this.updateForm();
		this.notifyColorChange();
	}

	onInputG(ev: Event) {
		const v = Math.max(0, Math.min(1, Number.parseInt((<HTMLInputElement>ev.target).value) / 100));
		if (isNaN(v)) {
			this.updateForm();
			return;
		}
		this._green = v;
		this.setHSV();
		++this.version;
		this.updateSvg();
		this.updateForm();
		this.notifyColorChange();
	}

	onInputB(ev: Event) {
		const v = Math.max(0, Math.min(1, Number.parseInt((<HTMLInputElement>ev.target).value) / 100));
		if (isNaN(v)) {
			this.updateForm();
			return;
		}
		this._blue = v;
		this.setHSV();
		++this.version;
		this.updateSvg();
		this.updateForm();
		this.notifyColorChange();
	}

	onInputA(ev: Event) {
		const v = Math.max(0, Math.min(1, Number.parseInt((<HTMLInputElement>ev.target).value) / 100));
		if (isNaN(v)) {
			this.updateForm();
			return;
		}
		this.alpha = v;
		++this.version;
		this.updateSvg();
		this.updateForm();
		this.notifyColorChange();
	}

	onInputH(ev: Event) {
		const v = Math.max(0, Math.min(6, Number.parseInt((<HTMLInputElement>ev.target).value) / 60));
		if (isNaN(v)) {
			this.updateForm();
			return;
		}
		this._hue = v;
		this.setRGB();
		++this.version;
		this.updateSvg();
		this.updateForm();
		this.notifyColorChange();
	}

	onInputS(ev: Event) {
		const v = Math.max(0, Math.min(1, Number.parseInt((<HTMLInputElement>ev.target).value) / 100));
		if (isNaN(v)) {
			this.updateForm();
			return;
		}
		this._saturation = v
		this.setRGB();
		++this.version;
		this.updateSvg();
		this.updateForm();
		this.notifyColorChange();
	}

	onInputV(ev: Event) {
		const v = Math.max(0, Math.min(1, Number.parseInt((<HTMLInputElement>ev.target).value) / 100));
		if (isNaN(v)) {
			this.updateForm();
			return;
		}
		this._brightness = v;
		this.setRGB();
		++this.version;
		this.updateSvg();
		this.updateForm();
		this.notifyColorChange();
	}

	onInputHTML(ev: Event) {
		const html = (<HTMLInputElement>ev.target).value;
		if (html.length === 6) {
			const r = Number.parseInt(html.substring(0, 2), 16) / 255;
			const g = Number.parseInt(html.substring(2, 4), 16) / 255;
			const b = Number.parseInt(html.substring(4, 6), 16) / 255;
			if (isNaN(r) || isNaN(g) || isNaN(b)) {
				this.updateForm();
				return;
			}
			this._red = r;
			this._green = g;
			this._blue = b;
			this.setHSV();
			++this.version;
			this.updateSvg();
			this.updateForm();
			this.notifyColorChange();
		}
	}

	private hsvToRgb(h: number, s: number, v: number): number[] {
		const min = v * (1 - s);
		const f = v - min;
		if (h < 1) {
			return [v, min + f * h, min];
		} else if (h < 2) {
			return [min + f * (2 - h), v, min];
		} else if (h < 3) {
			return [min, v, min + f * (h - 2)];
		} else if (h < 4) {
			return [min, min + f * (4 - h), v];
		} else if (h < 5) {
			return [min + f * (h - 4), min, v];
		} else {
			return [v, min, min + f * (6 - h)];
		}
	}

	private setRGB() {
		const rgb = this.hsvToRgb(this._hue, this._saturation, this._brightness);
		this._red = rgb[0];
		this._green = rgb[1];
		this._blue = rgb[2];
	}

	private setHSV() {
		this._brightness = Math.max(this._red, this._green, this._blue);
		const min = Math.min(this._red, this._green, this._blue);
		if (this._brightness > 0) {
			this._saturation = 1 - min / this._brightness;
		}
		if (this._brightness > min) {
			const f = 1 / (this._brightness - min);
			if (this._red === this._brightness) {
				if (this._green >= this._blue) {
					this._hue = (this._green - min) * f;
				} else {
					this._hue = 6 - (this._blue - min) * f;
				}
			} else if (this._green === this._brightness) {
				if (this._red >= this._blue) {
					this._hue = 2 - (this._red - min) * f;
				} else {
					this._hue = 2 + (this._blue - min) * f;
				}
			} else {
				if (this._red >= this._green) {
					this._hue = 4 + (this._red - min) * f;
				} else {
					this._hue = 4 - (this._green - min) * f;
				}
			}
		}

	}

	private updateSvg() {
		if (this.svg !== undefined) {
			this.svg.nativeElement.setAttribute('fill', `#${this.html}`);
			this.svg.nativeElement.setAttribute('fill-opacity', `${this.alpha}`);
		}
	}

	private updateOldSvg() {
		if (this.oldSvg !== undefined && this.initialColor !== undefined) {
			this.initialColor.buildFillAttributes(new FilledElementBuilderImp(this.oldSvg.nativeElement));
		}
	}

	private updateForm() {
		const v: ColorComponentValue = this.formGroup.value;
		v.red = Math.round(this._red * 1000) / 10;
		v.green = Math.round(this._green * 1000) / 10;
		v.blue = Math.round(this._blue * 1000) / 10;
		v.alpha = Math.round(this.alpha * 1000) / 10;
		v.hue = Math.round(this._hue * 600) / 10;
		v.saturation = Math.round(this._saturation * 1000) / 10;
		v.brightness = Math.round(this._brightness * 1000) / 10;
		v.html = this.html;
		this.formGroup.setValue(v);
	}

	private notifyColorChange() {
		this.onColorChange.emit(new SingleColor(this._red, this._green, this._blue, this.alpha));
	}
}
