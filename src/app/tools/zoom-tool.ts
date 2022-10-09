import { AbstractRectSelectTool } from './tool';
import { ViewService, ViewSelectMode } from '../view/view.service';
import { ViewContainerRef, ComponentRef } from '@angular/core';
import { TextService } from '../shared/text/text.service';

export class ZoomTool extends AbstractRectSelectTool {

	constructor(private readonly viewService: ViewService) {
		super(viewService);
	}

	createPropertiesComponent(container: ViewContainerRef): ComponentRef<any> | undefined {
		return undefined;
	}

	getHint(textService: TextService): string {
		return textService.get('tool.zoom.hint');
	}

	onSelect(x: number, y: number, width: number, height: number, mode: ViewSelectMode): void {
		this.viewService.zoomToFitRectangle(x, y, width, height, mode !== ViewSelectMode.REMOVE);
	}
}
