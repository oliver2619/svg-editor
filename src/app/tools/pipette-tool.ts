import { AbstractClickTool } from './tool';
import { ViewContainerRef, ComponentRef } from '@angular/core';
import { TextService } from '../shared/text/text.service';
import { ToolMouseEvent } from './tool-mouse-event';

export class PipetteTool extends AbstractClickTool {

	cleanUp() { }

	createPropertiesComponent(container: ViewContainerRef): ComponentRef<any> | undefined {
		return undefined;
	}

	getHint(textService: TextService): string {
		return '';
	}

	mouseDown(e: ToolMouseEvent): boolean {
		return false;
	}

}
