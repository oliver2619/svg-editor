import { Observable, Subject } from 'rxjs';
import { Injectable, ViewContainerRef, Type, EventEmitter } from '@angular/core';

export interface Dialog<T> {

	title: string;

	readonly onCancel: EventEmitter<void>;

	readonly onOk: EventEmitter<T>;

	init(value: T): void;
}

@Injectable({
	providedIn: 'root'
})
export class ModalService {

	private readonly _modalStack: HTMLElement[] = [];
	private viewContainer: ViewContainerRef | undefined;

	constructor() { }

	isElementActive(element: HTMLElement, ignoreActiveElements: boolean): boolean {
		if (ignoreActiveElements || document.activeElement === null || document.activeElement === document.body || document.activeElement instanceof HTMLButtonElement) {
			return this._isElementActive(element);
		} else {
			return false;
		}
	}

	isKeyEventActive(ev: KeyboardEvent, ignoreActiveElements: boolean): boolean {
		if (ev.target === null || !(ev.target instanceof HTMLElement)) {
			return false;
		}
		return this.isElementActive(ev.target, ignoreActiveElements);
	}

	registerViewContainer(viewContainer: ViewContainerRef) {
		this.viewContainer = viewContainer;
	}

	showDialog<T, C extends Dialog<T>>(type: Type<C>, value: T, title: string): Observable<T> {
		const ret = new Subject<T>();
		if (this.viewContainer !== undefined) {
			const componentRef = this.viewContainer.createComponent(type);
			componentRef.instance.title = title;
			componentRef.instance.init(value);
			componentRef.instance.onCancel.subscribe({
				next: () => {
					componentRef.destroy();
				}
			});
			componentRef.instance.onOk.subscribe({
				next: (value: T) => {
					componentRef.destroy();
					ret.next(value);
				}
			});
		}
		return ret;
	}

	unregisterViewContainer(viewContainer: ViewContainerRef) {
		if (this.viewContainer === viewContainer) {
			this.viewContainer = undefined;
		}
	}

	onShowModal(element: HTMLElement) {
		this._modalStack.push(element);
	}

	onHideModal(element: HTMLElement) {
		const i = this._modalStack.findIndex(el => el === element);
		if (i >= 0) {
			this._modalStack.splice(i, 1);
		}
	}

	private _isElementActive(el: HTMLElement): boolean {
		if (this._modalStack.length === 0) {
			return true;
		}
		if (el === this._modalStack[this._modalStack.length - 1]) {
			return true;
		}
		if (el.parentElement === null) {
			return false;
		}
		return this._isElementActive(el.parentElement);
	}
}
