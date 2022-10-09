import { Tool } from './tool';
import { ViewService } from '../view/view.service';
import { ViewContainerRef, ComponentRef } from '@angular/core';
import { ToolMouseEvent } from './tool-mouse-event';
import { TextService } from '../shared/text/text.service';
import { Coordinate } from '../model/coordinate';

export class PanningTool implements Tool {

	readonly cursor = 'grab';
	readonly requiresLocalCoordinates = false;

	private readonly startClick: Coordinate = new Coordinate(0, 0);
	private startScroll: Coordinate = new Coordinate(0, 0);

	constructor(private readonly viewService: ViewService) { }

	cleanUp() { }

	createPropertiesComponent(container: ViewContainerRef): ComponentRef<any> | undefined {
		return undefined;
	}

	getHint(textService: TextService): string { return ''; }

	mouseDown(e: ToolMouseEvent): boolean {
		this.startClick.x = e.x;
		this.startClick.y = e.y;
		this.startScroll = this.viewService.scrollPosition;
		return true;
	}

	mouseMove(e: ToolMouseEvent): void {
		this.viewService.scrollTo(this.startScroll.x + this.startClick.x - e.x, this.startScroll.y + this.startClick.y - e.y);
	}

	mouseUp(e: ToolMouseEvent): void { }
}

