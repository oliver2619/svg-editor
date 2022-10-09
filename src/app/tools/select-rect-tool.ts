import { AbstractRectSelectTool } from './tool';
import { ViewService, ViewSelectMode } from '../view/view.service';
import { ViewContainerRef, ComponentRef } from '@angular/core';
import { TextService } from '../shared/text/text.service';

export class SelectRectTool extends AbstractRectSelectTool {

	constructor(private readonly viewService: ViewService) {
		super(viewService);
	}

	createPropertiesComponent(container: ViewContainerRef): ComponentRef<any> | undefined {
		return undefined;
	}

	getHint(textService: TextService): string {
		return textService.get('tool.select.hint');
	}

	onSelect(x: number, y: number, width: number, height: number, mode: ViewSelectMode): void {
		this.viewService.selectByRectangle(x, y, width, height, mode);
	}
}
