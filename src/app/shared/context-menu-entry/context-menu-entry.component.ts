import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ElementRef, HostListener, OnDestroy, EventEmitter } from '@angular/core';
import { Action } from '../action/action';
import { ActionService } from '../action/action.service';
import { Subscription } from 'rxjs';
import { TextService } from '../text/text.service';

@Component({
	selector: 'se-context-menu-entry',
	templateUrl: './context-menu-entry.component.html',
	styleUrls: ['./context-menu-entry.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContextMenuEntryComponent implements OnChanges, OnDestroy {

	@Input('action')
	actionInput: string | Action | undefined;

	readonly onAction = new EventEmitter<Action>();

	private _action: Action | undefined;
	private actionSubscription: Subscription | undefined;

	constructor(private readonly element: ElementRef<HTMLElement>, private readonly actionService: ActionService, private readonly textService: TextService) { }

	get action(): Action | undefined { return this._action; }

	get fullImageUrl(): string | undefined {
		return this._action !== undefined ? `assets/${this._action.icon}` : undefined;
	}

	get hasImage(): boolean {
		return this._action !== undefined && this._action.icon !== undefined;
	}

	get hasShortcut(): boolean {
		return false;
	}

	get name(): string {
		return this._action !== undefined ? this._action.name : '';
	}

	get shortcut(): string {
		return this._action !== undefined && this._action.shortcut !== undefined ? this._action.shortcut.getHelp(this.textService) : '';
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.updateActionInput();
	}

	ngOnDestroy(): void {
		if (this.actionSubscription !== undefined) {
			this.actionSubscription.unsubscribe();
			this.actionSubscription = undefined;
		}
	}

	@HostListener('click')
	click(): void {
		if (this._action !== undefined) {
			this.onAction.emit(this._action);
			this._action.execute();
		}
	}

	private updateActionInput() {
		if (this.actionInput !== undefined) {
			if (typeof this.actionInput === 'string') {
				this.setAction(this.actionService.get(this.actionInput));
			} else {
				this.setAction(this.actionInput);
			}
		} else {
			this.setAction(undefined);
		}
	}

	private setAction(action: Action | undefined) {
		if (this._action !== action) {
			if (this.actionSubscription !== undefined) {
				this.actionSubscription.unsubscribe();
				this.actionSubscription = undefined;
			}
			this._action = action;
			if (this._action !== undefined) {
				this.actionSubscription = this._action.onChange.subscribe({
					next: (a: Action) => {
						this.updateAction(a);
					}
				});
				this.updateAction(this._action);
			}
		}
	}

	private updateAction(a: Action) {
		if (a.enabled) {
			this.element.nativeElement.classList.remove('disabled');
		} else {
			this.element.nativeElement.classList.add('disabled');
		}
		if (a.active) {
			this.element.nativeElement.classList.add('active');
		} else {
			this.element.nativeElement.classList.remove('active');
		}
		this.element.nativeElement.title = a.tooltip;
	}
}
