import { ChangeDetectionStrategy, Component, ViewContainerRef, ComponentRef } from '@angular/core';
import { AbstractDrawTool } from '../tool';
import { FormGroup, FormBuilder } from '@angular/forms';

export class LibraryTool extends AbstractDrawTool {

	cleanUp() {}
	
	createPropertiesComponent(container: ViewContainerRef): ComponentRef<any> | undefined {
		return container.createComponent(LibraryComponent);
	}

	protected onComplete(startX: number, startY: number, targetX: number, targetY: number): void {
	}

	protected onDraw(startX: number, startY: number, targetX: number, targetY: number): void {
	}

	protected onStart(x: number, y: number): void {
	}
}

interface FilterComponentValue {
	filter: string;
}

@Component({
	selector: 'se-library',
	templateUrl: './library.component.html',
	styleUrls: ['./library.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LibraryComponent {

	readonly formGroup: FormGroup;

	constructor(formBuilder: FormBuilder) {
		this.formGroup = formBuilder.group({});
		this.formGroup.addControl('filter', formBuilder.control('', []));
	}
}
