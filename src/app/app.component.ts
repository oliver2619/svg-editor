import { Subscription } from 'rxjs';
import { Component, OnDestroy, ViewChild, ViewContainerRef, AfterViewInit, HostListener } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ModelService } from './model/model.service';
import { SvgModel } from './model/svg-model';
import { ModalService } from './shared/modal.service';
import { SettingsService } from './settings/settings.service';
import { Settings } from './settings/settings';
import { ActionService } from './shared/action/action.service';

@Component({
	selector: 'se-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnDestroy {

	private static readonly PREVENTED_KEYS = /^F[0-9]+$/;

	@ViewChild('dialogLayer', { read: ViewContainerRef })
	dialogViewContainerRef: ViewContainerRef | undefined;

	uiSize: string;

	private readonly documentSubscription: Subscription;
	private readonly settingsSubscription: Subscription;

	constructor(private readonly modalService: ModalService, private readonly actionService: ActionService, settingsService: SettingsService, modelService: ModelService) {
		this.documentSubscription = modelService.onDocumentChange.subscribe({
			next: (doc: SvgModel) => {
				document.title = `SVG Editor - ${doc.title}`
			}
		});
		this.settingsSubscription = settingsService.onChange.subscribe({
			next: (settings: Settings) => {
				this.uiSize = settings.uiSize;
				this.updateUiClass();
			}
		});
		this.uiSize = settingsService.uiSize;
		this.updateUiClass();
	}


	ngAfterViewInit(): void {
		if (this.dialogViewContainerRef !== undefined) {
			this.modalService.registerViewContainer(this.dialogViewContainerRef);
		}
	}

	ngOnDestroy(): void {
		if (this.dialogViewContainerRef !== undefined) {
			this.modalService.unregisterViewContainer(this.dialogViewContainerRef);
		}
		this.documentSubscription.unsubscribe();
		this.settingsSubscription.unsubscribe();
	}

	@HostListener('document:keydown', ['$event'])
	onKeyDown(e: KeyboardEvent) {
		if (this.modalService.isKeyEventActive(e, false)) {
			this.actionService.keyDown(e);
		}
		switch (e.code) {
			case 'ArrowLeft':
			case 'ArrowRight':
				if (e.altKey && environment.production) {
					e.preventDefault();
				}
				break;
			case 'F5':
			case 'F12':
				if (environment.production) {
					e.preventDefault();
				}
				break;
			default:
				if (AppComponent.PREVENTED_KEYS.test(e.code)) {
					e.preventDefault();
				} else {
					// console.log(e.code);
				}
		}
	}

	@HostListener('document:contextmenu', ['$event'])
	onContextMenu(e: Event) {
		e.preventDefault();
	}

	private updateUiClass() {
		document.body.classList.remove('ui-small');
		document.body.classList.remove('ui-medium');
		document.body.classList.remove('ui-large');
		document.body.classList.add(`ui-${this.uiSize}`);
	}
}
