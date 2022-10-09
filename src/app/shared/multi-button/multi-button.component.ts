import { Subscription } from 'rxjs';
import { ChangeDetectionStrategy, Component, Input, AfterViewInit, OnDestroy, ContentChild } from '@angular/core';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
import { Action } from '../action/action';

@Component({
	selector: 'se-multi-button',
	templateUrl: './multi-button.component.html',
	styleUrls: ['./multi-button.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultiButtonComponent implements AfterViewInit, OnDestroy {

	private static readonly DELAY = 250;

	@Input('button')
	button: HTMLButtonElement | undefined;

	@Input('align')
	align: string = 'bottom right';

	@ContentChild(ContextMenuComponent)
	contextMenu: ContextMenuComponent | undefined;

	private readonly onButtonDown = (ev: MouseEvent) => {
		this.buttonDownTime = performance.now();
	};

	private readonly onButtonClick = (ev: MouseEvent) => {
		const delay = performance.now() - this.buttonDownTime;
		if (this.lastAction === undefined || delay > MultiButtonComponent.DELAY) {
			if (this.contextMenu !== undefined && this.button !== undefined) {
				this.contextMenu.showRelativeTo(this.button, this.align);
			}
		} else {
			this.lastAction.execute();
		}
	};

	private menuSubscription: Subscription | undefined;
	private actionSubscription: Subscription | undefined;
	private lastAction: Action | undefined;
	private buttonDownTime: number = performance.now();

	ngAfterViewInit(): void {
		if (this.button !== undefined) {
			this.button.addEventListener('click', this.onButtonClick);
			this.button.addEventListener('mousedown', this.onButtonDown);
		}
		if (this.contextMenu !== undefined) {
			this.menuSubscription = this.contextMenu.onAction.subscribe({
				next: (a: Action) => {
					this.setLastAction(a);
				}
			});
			const actions = this.contextMenu.getActions();
			const active = actions.find(a => a.active);
			if (active !== undefined) {
				this.setLastAction(active);
			} else if (actions.length > 0) {
				this.setLastAction(actions[0]);
			}
		}
	}

	ngOnDestroy(): void {
		if (this.button !== undefined) {
			this.button.removeEventListener('click', this.onButtonClick);
			this.button.removeEventListener('mousedown', this.onButtonDown);
		}
		if (this.menuSubscription !== undefined) {
			this.menuSubscription.unsubscribe();
		}
		if (this.actionSubscription !== undefined) {
			this.actionSubscription.unsubscribe();
		}
	}

	private setLastAction(a: Action) {
		if (this.lastAction !== a) {
			this.lastAction = a;
			if (this.actionSubscription !== undefined) {
				this.actionSubscription.unsubscribe();
			}
			this.actionSubscription = this.lastAction.onChange.subscribe({
				next: (ac: Action) => {
					this.onLastActionChange(ac);
				}
			});
			this.onLastActionChange(this.lastAction);
			if (this.button !== undefined) {
				this.button.innerHTML = '';
				if (a.icon !== undefined) {
					this.button.innerHTML = `<img src="/assets/${a.icon}"><img src="/assets/icons/bullet_arrow_down.png" class="overlay">`;
				} else {
					this.button.innerHTML = `${a.name}<img src="/assets/icons/bullet_arrow_down.png">`;
				}
				this.button.title = a.tooltip;
			}
		}
	}

	private onLastActionChange(a: Action) {
		if (this.button !== undefined) {
			if (a.active) {
				this.button.classList.add('active');
			} else {
				this.button.classList.remove('active');
			}
		}
	}
}
