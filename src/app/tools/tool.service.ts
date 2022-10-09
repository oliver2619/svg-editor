import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Tool } from './tool';
import { ToolMouseEvent } from './tool-mouse-event';
import { ViewService } from '../view/view.service';
import { CropTool } from './crop/crop.component';
import { MoveTool } from './move/move.component';
import { RotateTool } from './rotate/rotate.component';
import { ScaleTool } from './scale/scale.component';
import { PencilTool } from './pencil/pencil.component';
import { PolygonTool } from './polygon/polygon.component';
import { TextTool } from './text/text.component';
import { ImageTool } from './image/image.component';
import { LibraryTool } from './library/library.component';
import { MeasureTool } from './measure/measure.component';
import { SettingsService } from '../settings/settings.service';
import { PathTool } from './path/path.component';
import { SelectTool } from './select/select.component';
import { RectTool } from './rect/rect.component';
import { EllipseTool } from './ellipse-tool';
import { LineTool } from './line-tool';
import { PanningTool } from './panning-tool';
import { PipetteTool } from './pipette-tool';
import { ZoomTool } from './zoom-tool';
import { CircleTool } from './circle-tool';
import { SelectRectTool } from './select-rect-tool';

export interface Tools {

	readonly current: Tool;
}

@Injectable({
	providedIn: 'root'
})
export class ToolService implements Tools {

	readonly onToolChange = new Subject<Tools>();

	private readonly toolsById: { [key: string]: Tool } = {
		circle: new CircleTool(this.viewService),
		crop: new CropTool(this.viewService),
		ellipse: new EllipseTool(this.viewService),
		image: new ImageTool(this.viewService),
		library: new LibraryTool(this.viewService),
		line: new LineTool(this.viewService),
		measure: new MeasureTool(this.viewService),
		move: new MoveTool(this.viewService),
		panning: new PanningTool(this.viewService),
		path: new PathTool(this.viewService),
		pencil: new PencilTool(this.viewService),
		pipette: new PipetteTool(),
		polygon: new PolygonTool(this.viewService),
		rect: new RectTool(this.viewService),
		rotate: new RotateTool(),
		scale: new ScaleTool(),
		select: new SelectTool(this.viewService),
		selectRect: new SelectRectTool(this.viewService),
		text: new TextTool(this.viewService),
		zoom: new ZoomTool(this.viewService)
	};

	private readonly idByTool = new Map<Tool, string>();

	private _current: Tool = this.toolsById['select'];

	get current(): Tool { return this._current; }

	set current(tool: Tool) {
		if (this._current !== tool) {
			if (this._current !== undefined) {
				this._current.cleanUp();
			}
			this._current = tool;
			const toolId = this.idByTool.get(tool);
			if (toolId !== undefined) {
				this.settingsService.merge(settings => settings.tools.currentTool = toolId);
			}
			this.onToolChange.next(this);
		}
	}

	get cursor(): string {
		return this._current.cursor;
	}

	get requiresLocalCoordinates(): boolean {
		return this._current.requiresLocalCoordinates;
	}

	constructor(private readonly viewService: ViewService, private readonly settingsService: SettingsService) {
		this._current = this.toolsById[this.settingsService.currentTool];
		Object.entries(this.toolsById).forEach(t => this.idByTool.set(t[1], t[0]));
	}

	get(id: string): Tool {
		const tool = this.toolsById[id];
		if (tool === undefined) {
			throw new RangeError(`Tool ${id} not found`);
		}
		return tool;
	}

	mouseDown(ev: ToolMouseEvent): boolean {
		return this._current.mouseDown(ev);
	}

	mouseMove(ev: ToolMouseEvent) {
		this._current.mouseMove(ev);
	}

	mouseUp(ev: ToolMouseEvent) {
		this._current.mouseUp(ev);
	}
}
