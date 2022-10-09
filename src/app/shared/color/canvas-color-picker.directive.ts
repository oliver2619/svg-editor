import { Directive, ElementRef, Input, HostListener, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';

@Directive({
	selector: '[seCanvasColorPicker]'
})
export class CanvasColorPickerDirective implements OnChanges {

	@Input('orientation')
	orientation: string = 'horizontal';

	@Input('valueX')
	valueX: number = 0;

	@Input('valueY')
	valueY: number = 0;

	@Input('version')
	set version(v: number) {
	}

	@Input('paint')
	paintCallback: ((x: number, y: number, rgba: number[]) => void) | undefined;

	@Output('change')
	onChange = new EventEmitter<number[]>();

	@HostListener('pointerdown', ['$event'])
	onMouseDown(ev: PointerEvent) {
		this.element.nativeElement.setPointerCapture(ev.pointerId);
		this.updateSelection(ev);
	}

	@HostListener('pointermove', ['$event'])
	onMouseMove(ev: PointerEvent) {
		if (this.element.nativeElement.hasPointerCapture(ev.pointerId)) {
			this.updateSelection(ev);
		}
	}

	@HostListener('pointerup', ['$event'])
	onMouseUp(ev: PointerEvent) {
		if (this.element.nativeElement.hasPointerCapture(ev.pointerId)) {
			this.element.nativeElement.releasePointerCapture(ev.pointerId);
		}
	}

	private readonly context: CanvasRenderingContext2D | null;
	private readonly imageData: ImageData | undefined;

	constructor(private readonly element: ElementRef<HTMLCanvasElement>) {
		this.context = this.element.nativeElement.getContext('2d', { alpha: true });
		if (this.context !== null) {
			this.imageData = this.context.getImageData(0, 0, this.context.canvas.width, this.context.canvas.height);
		}
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.update();
	}

	private updateSelection(ev: PointerEvent) {
		if (this.orientation === 'horizontal') {
			this.setValue(Math.max(0, Math.min(1, ev.offsetX / (this.element.nativeElement.clientWidth - 1))), 0);
		} else if (this.orientation === 'vertical') {
			this.setValue(0, Math.max(0, Math.min(1, 1 - ev.offsetY / (this.element.nativeElement.clientHeight - 1))));
		} else {
			this.setValue(Math.max(0, Math.min(1, ev.offsetX / (this.element.nativeElement.clientWidth - 1))), Math.max(0, Math.min(1, 1 - ev.offsetY / (this.element.nativeElement.clientHeight - 1))));
		}
	}

	private setValue(x: number, y: number) {
		this.onChange.emit([x, y]);
	}

	private update() {
		this.paintBackground();
		this.paintSelection();
	}

	private paintBackground() {
		if (this.context !== null && this.paintCallback !== undefined && this.imageData !== undefined) {
			const rgba = [0, 0, 0, 0];
			for (let y = 0; y < this.imageData.height; ++y) {
				const ly: number = y * 4 * this.imageData.width;
				for (let x = 0; x < this.imageData.width; ++x) {
					rgba[0] = 0;
					rgba[1] = 0;
					rgba[2] = 0;
					rgba[3] = 1;
					this.paintCallback(x / (this.imageData.width - 1), 1 - y / (this.imageData.height - 1), rgba);
					const i = ly + x * 4;
					this.imageData.data[i] = Math.floor(rgba[0] * 255) | 0;
					this.imageData.data[i + 1] = Math.floor(rgba[1] * 255) | 0;
					this.imageData.data[i + 2] = Math.floor(rgba[2] * 255) | 0;
					this.imageData.data[i + 3] = Math.floor(rgba[3] * 255) | 0;
				}
			}
			this.context.putImageData(this.imageData, 0, 0);
		}
	}

	private paintSelection() {
		if (this.context !== null) {
			this.context.fillStyle = 'black';
			this.context.strokeStyle = 'white';
			if (this.orientation === 'horizontal') {
				const x = Math.round(this.valueX * (this.context.canvas.width - 1));
				this.context.fillRect(x - 2, 0, 5, this.context.canvas.height);
				this.context.beginPath();
				this.context.moveTo(x + 0.5, 0);
				this.context.lineTo(x + 0.5, this.context.canvas.height);
				this.context.stroke();
			} else if (this.orientation === 'vertical') {
				const y = Math.round((1 - this.valueY) * (this.context.canvas.height - 1));
				this.context.fillRect(0, y - 2, this.context.canvas.width, 5);
				this.context.beginPath();
				this.context.moveTo(0, y + 0.5);
				this.context.lineTo(this.context.canvas.width, y + 0.5);
				this.context.stroke();
			} else {
				const x = Math.round(this.valueX * (this.context.canvas.width - 1));
				const y = Math.round((1 - this.valueY) * (this.context.canvas.height - 1));
				this.context.fillRect(x - 2, 0, 5, this.context.canvas.height);
				this.context.fillRect(0, y - 2, this.context.canvas.width, 5);
				this.context.beginPath();
				this.context.moveTo(x + 0.5, 0);
				this.context.lineTo(x + 0.5, this.context.canvas.height);
				this.context.moveTo(0, y + 0.5);
				this.context.lineTo(this.context.canvas.width, y + 0.5);
				this.context.stroke();
			}
		}
	}
}
