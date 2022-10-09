import { Subscription } from 'rxjs';
import { Directive, Input, OnChanges, SimpleChanges, ElementRef, OnDestroy, HostListener } from '@angular/core';
import { ActionService } from './action.service';
import { Action } from './action';
import { TextService } from '../text/text.service';

@Directive({
	selector: '[seAction]'
})
export class ActionDirective implements OnChanges, OnDestroy {

	@Input('seAction')
	actionName: string | undefined;

	private action: Action | undefined
	private actionSubscription: Subscription | undefined;

	constructor(private readonly element: ElementRef<HTMLElement>, private readonly actionService: ActionService, private readonly textService: TextService) { }

	ngOnDestroy(): void {
		if (this.actionSubscription !== undefined) {
			this.actionSubscription.unsubscribe();
			this.actionSubscription = undefined;
		}
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (this.actionName !== undefined) {
			this.setAction(this.actionService.get(this.actionName));
		} else {
			this.setAction(undefined);
		}
	}

	@HostListener('click')
	click(): void {
		if (this.action !== undefined) {
			this.action.execute();
		}
	}

	private setAction(action: Action | undefined) {
		if (this.action !== action) {
			if (this.actionSubscription !== undefined) {
				this.actionSubscription.unsubscribe();
				this.actionSubscription = undefined;
			}
			this.action = action;
			if (this.action !== undefined) {
				this.actionSubscription = this.action.onChange.subscribe({
					next: (a: Action) => {
						this.updateAction(a);
					}
				});
				this.initAction(this.action);
			}
		}
	}

	private updateAction(a: Action) {
		if (a.enabled) {
			this.element.nativeElement.removeAttribute('disabled');
		} else {
			this.element.nativeElement.setAttribute('disabled', 'disabled');
		}
		if (a.active) {
			this.element.nativeElement.classList.add('active');
		} else {
			this.element.nativeElement.classList.remove('active');
		}
		const title: string[] = [a.tooltip];
		if (a.shortcut !== undefined) {
			title.push(`[${a.shortcut.getHelp(this.textService)}]`);
		}
		this.element.nativeElement.title = title.join('\n');
	}

	private initAction(a: Action) {
		if (a.icon !== undefined) {
			this.element.nativeElement.innerHTML = `<img src="assets/${a.icon}">`
		} else {
			this.element.nativeElement.innerText = a.name;
		}
		this.updateAction(a);
	}
}
