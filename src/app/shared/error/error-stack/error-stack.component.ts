import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ErrorService } from '../error.service';

class Element {

	constructor(readonly message: string = '') { }

}

@Component({
	selector: 'se-error-stack',
	templateUrl: './error-stack.component.html',
	styleUrls: ['./error-stack.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorStackComponent implements OnDestroy {

	elements: Element[] = [];

	private errorServiceSubscription: Subscription;
	
	constructor(errorService: ErrorService, changeDetectorRef: ChangeDetectorRef) {
		this.errorServiceSubscription = errorService.onError.subscribe({
			next: msg => {
				this.elements.push(new Element(msg));
				changeDetectorRef.markForCheck();
			}
		});
	}

	ngOnDestroy(): void {
		this.errorServiceSubscription.unsubscribe();
	}

	onClose(i: number) {
		this.elements.splice(i, 1);
	}
}
