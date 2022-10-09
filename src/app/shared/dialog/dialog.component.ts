import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { TextService } from '../text/text.service';
import { ModalService } from '../modal.service';

export interface DialogAction {
	readonly name: string;
	action: () => any;
	active?: () => boolean;
}

@Component({
	selector: 'se-dialog',
	templateUrl: './dialog.component.html',
	styleUrls: ['./dialog.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogComponent implements AfterViewInit, OnDestroy {

	@Input('buttons')
	buttons: string = 'ok';

	@Input('additional-buttons')
	additionalButtons: DialogAction[] = [];

	@Input('title')
	title: string = '';

	@Input('ok-enabled')
	okEnabled: () => boolean = () => true;

	@Input('ok-text')
	okTextInput: string | undefined;

	@Input('cancel-text')
	cancelTextInput: string | undefined;

	@Output('ok')
	okEmitter = new EventEmitter<void>();

	@Output('no')
	noEmitter = new EventEmitter<void>();

	@Output('cancel')
	cancelEmitter = new EventEmitter<void>();

	get cancelVisible(): boolean {
		return this.buttonsContain('cancel');
	}

	get closeVisible(): boolean {
		return this.buttonsContain('close');
	}

	get noVisible(): boolean {
		return this.buttonsContain('no');
	}

	get okDisabled(): boolean {
		return !this.okEnabled();
	}

	get okText(): string {
		return this.okTextInput !== undefined ? this.okTextInput : this.textService.get('dialog.ok');
	}

	get okVisible(): boolean {
		return this.buttonsContain('ok');
	}

	get yesVisible(): boolean {
		return this.buttonsContain('yes');
	}

	constructor(private readonly element: ElementRef<HTMLElement>, private readonly textService: TextService, private readonly modalService: ModalService) { }

	ngAfterViewInit(): void {
		this.modalService.onShowModal(this.element.nativeElement);
	}

	ngOnDestroy(): void {
		this.modalService.onHideModal(this.element.nativeElement);
	}

	onOk() {
		this.okEmitter.emit();
	}

	onNo() {
		this.noEmitter.emit();
	}

	onCancel() {
		this.cancelEmitter.emit();
	}

	onButton(i: number) {
		this.additionalButtons[i].action();
	}

	private buttonsContain(button: string): boolean {
		return this.buttons.split(/[ \/\.]+/g).some(it => it === button);
	}
}
