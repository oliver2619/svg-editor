import { Subscription } from 'rxjs';
import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, AfterViewInit, ContentChildren, QueryList, EventEmitter } from '@angular/core';
import { ContextMenuEntryComponent } from '../context-menu-entry/context-menu-entry.component';
import { Action } from '../action/action';

@Component({
	selector: 'se-context-menu',
	templateUrl: './context-menu.component.html',
	styleUrls: ['./context-menu.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContextMenuComponent implements AfterViewInit, OnDestroy {

	@ContentChildren(ContextMenuEntryComponent)
	entries: QueryList<ContextMenuEntryComponent> | undefined;

	readonly onAction = new EventEmitter<Action>();

	private visible = false;

	private actionSubscriptions: Subscription[] | undefined;

	private readonly onDocumentClick = (ev: MouseEvent) => {
		if (this.visible) {
			this.element.nativeElement.classList.remove('visible');
			this.visible = false;
		}
	};

	constructor(private readonly element: ElementRef<HTMLElement>) { }

	getActions(): Action[] {
		if (this.entries !== undefined) {
			return this.entries.map(e => e.action).filter(a => a !== undefined) as Action[];
		} else {
			return [];
		}
	}

	ngAfterViewInit(): void {
		document.addEventListener('click', this.onDocumentClick, {
			capture: true
		});
		if (this.entries !== undefined) {
			this.actionSubscriptions = this.entries.map(e => e.onAction.subscribe({
				next: (a: Action) => {
					this.onAction.emit(a);
				}
			}));
		}
	}

	ngOnDestroy(): void {
		document.removeEventListener('click', this.onDocumentClick);
		if (this.actionSubscriptions !== undefined) {
			this.actionSubscriptions.forEach(s => s.unsubscribe());
		}
	}

	showRelativeTo(element: HTMLElement, align: string): void {
		if (!this.visible) {
			this.element.nativeElement.classList.add('visible');
			const aligns = align.split(/[ ]+/);
			if (aligns.indexOf('top') >= 0) {
				this.element.nativeElement.style.top = `${element.offsetTop - this.element.nativeElement.offsetHeight}px`;
			} else {
				this.element.nativeElement.style.top = `${element.offsetTop + element.offsetHeight}px`;
			}
			if (aligns.indexOf('left') >= 0) {
				this.element.nativeElement.style.left = `${element.offsetLeft + element.offsetWidth - this.element.nativeElement.offsetWidth}px`;
			} else if(aligns.indexOf('center') >= 0) {
				this.element.nativeElement.style.left = `${element.offsetLeft + element.offsetWidth * .5 - this.element.nativeElement.offsetWidth * .5}px`;
			}else {
				this.element.nativeElement.style.left = `${element.offsetLeft}px`;
			}
			this.visible = true;
		}
	}
}
