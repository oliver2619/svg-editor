import { ChangeDetectionStrategy, Component, ViewContainerRef, ComponentRef } from '@angular/core';
import { AbstractDrawTool } from '../tool';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

export class TextTool extends AbstractDrawTool {

	override get cursor(): string { return 'text'; }

	cleanUp() {}
	
	createPropertiesComponent(container: ViewContainerRef): ComponentRef<any> | undefined {
		return container.createComponent(TextComponent);
	}

	protected onComplete(startX: number, startY: number, targetX: number, targetY: number): void {
	}

	protected onDraw(startX: number, startY: number, targetX: number, targetY: number): void {
	}

	protected onStart(x: number, y: number): void {
	}
}

interface TextComponentValue {
	fontFamily: string;
	fontSize: number;
}

@Component({
	selector: 'se-text',
	templateUrl: './text.component.html',
	styleUrls: ['./text.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextComponent {

	readonly formGroup: FormGroup;
	readonly fonts: string[] = ['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy'];

	get fontFamily(): string {
		return (<TextComponentValue>this.formGroup.value).fontFamily;
	}

	get fontSize(): string {
		return `${(<TextComponentValue>this.formGroup.value).fontSize}pt`;
	}
	
	constructor(formBuilder: FormBuilder) {
		this.formGroup = formBuilder.group({});
		this.formGroup.addControl('fontFamily', formBuilder.control('sans-serif', [Validators.required]));
		this.formGroup.addControl('fontSize', formBuilder.control(10, [Validators.required, Validators.min(0)]));
	}
}
