import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ErrorService {

	readonly onError = new Subject<string>();

	constructor() { }

	showError(errorMessage: string) {
		this.onError.next(errorMessage);
	}
}
