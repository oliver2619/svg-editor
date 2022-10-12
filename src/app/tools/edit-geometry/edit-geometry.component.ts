import { ChangeDetectionStrategy, Component, ComponentRef, OnInit, ViewContainerRef } from '@angular/core';
import { TextService } from 'src/app/shared/text/text.service';
import { Tool } from '../tool';
import { ToolMouseEvent } from '../tool-mouse-event';

export class EditGeometryTool implements Tool {

	readonly cursor = 'move';
	readonly requiresLocalCoordinates = true;
	readonly selectionPivotVisible = false;

	cleanUp(): void {
	}

	createPropertiesComponent(container: ViewContainerRef): ComponentRef<any> | undefined {
		const ret = container.createComponent(EditGeometryComponent);
		ret.instance;
		return ret;
	}

	getHint(textService: TextService): string {
		return '';
	}

	mouseDown(e: ToolMouseEvent): boolean {
		return false;
	}

	mouseMove(e: ToolMouseEvent): void {
	}

	mouseUp(e: ToolMouseEvent): void {
	}

	mouseHover(e: ToolMouseEvent): void { }
}

@Component({
	selector: 'se-edit-geometry',
	templateUrl: './edit-geometry.component.html',
	styleUrls: ['./edit-geometry.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditGeometryComponent implements OnInit {

	constructor() { }

	ngOnInit(): void {
	}

}
