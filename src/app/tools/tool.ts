import { ToolMouseEvent } from './tool-mouse-event';
import { ViewService, ViewSelectMode } from '../view/view.service';
import { ViewContainerRef, ComponentRef } from '@angular/core';
import { TextService } from '../shared/text/text.service';
import { GroupBuilder } from '../model/svg-builder/group-builder';
import { RectBuilder } from '../model/svg-builder/rect-builder';

export interface Tool {

	readonly cursor: string;
	readonly requiresLocalCoordinates: boolean;
	readonly selectionPivotVisible: boolean;

	cleanUp(): void;

	createPropertiesComponent(container: ViewContainerRef): ComponentRef<any> | undefined;

	getHint(textService: TextService): string;

	mouseDown(e: ToolMouseEvent): boolean;

	mouseMove(e: ToolMouseEvent): void;

	mouseUp(e: ToolMouseEvent): void;

	mouseHover(e: ToolMouseEvent): void;
}

export abstract class AbstractMoveTool implements Tool {

	private x: number = 0;
	private y: number = 0;

	get cursor(): string { return 'move'; }

	get selectionPivotVisible(): boolean { return false; }

	constructor(readonly requiresLocalCoordinates: boolean) { }

	abstract cleanUp(): void;

	abstract createPropertiesComponent(container: ViewContainerRef): ComponentRef<any> | undefined;

	abstract getHint(textService: TextService): string;

	mouseDown(e: ToolMouseEvent): boolean {
		this.x = e.x;
		this.y = e.y;
		this.onMouseDown(e);
		return true;
	}

	mouseMove(e: ToolMouseEvent): void {
		this.onMove(e.x - this.x, e.y - this.y, e.shiftKey);
	}

	mouseUp(e: ToolMouseEvent): void {
		this.onMouseUp(e.x - this.x, e.y - this.y, e.shiftKey);
	}

	mouseHover(e: ToolMouseEvent): void { }

	protected abstract onMouseDown(e: ToolMouseEvent): void;

	protected abstract onMove(dx: number, dy: number, snapToDiscreteValues: boolean): void;

	protected abstract onMouseUp(dx: number, dy: number, snapToDiscreteValues: boolean): void;
}

export abstract class AbstractRectSelectTool implements Tool {

	readonly cursor = 'crosshair';
	readonly selectionPivotVisible = false;
	readonly requiresLocalCoordinates = true;

	private startX = 0;
	private startY = 0;
	private readonly groupBuilder: GroupBuilder;
	private rectangleBuilder: RectBuilder | undefined;
	private mode = ViewSelectMode.REPLACE;

	constructor(viewService: ViewService) {
		this.groupBuilder = viewService.toolGroupBuilder;
	}

	cleanUp(): void {
		if (this.rectangleBuilder !== undefined) {
			this.groupBuilder.clearShapes();
			this.rectangleBuilder = undefined;
		}
	}

	abstract createPropertiesComponent(container: ViewContainerRef): ComponentRef<any> | undefined;

	abstract getHint(textService: TextService): string;

	mouseDown(e: ToolMouseEvent): boolean {
		if (e.shiftKey && !e.ctrlKey) {
			this.mode = ViewSelectMode.ADD;
		} else if (e.ctrlKey && !e.shiftKey) {
			this.mode = ViewSelectMode.REMOVE;
		} else if (!e.ctrlKey && !e.shiftKey) {
			this.mode = ViewSelectMode.REPLACE;
		}
		this.startX = e.x;
		this.startY = e.y;
		this.groupBuilder.clearShapes();
		this.rectangleBuilder = this.groupBuilder.rect(e.x, e.y, 0, 0);
		this.rectangleBuilder.setClass('selection');
		return true;
	}

	mouseMove(e: ToolMouseEvent): void {
		this.processMouse(e, false);
	}

	mouseUp(e: ToolMouseEvent): void {
		this.processMouse(e, true);
	}

	mouseHover(e: ToolMouseEvent): void { }

	protected abstract onSelect(x: number, y: number, width: number, height: number, mode: ViewSelectMode): void;

	private processMouse(e: ToolMouseEvent, finish: boolean) {
		if (this.rectangleBuilder !== undefined) {
			const x = Math.min(this.startX, e.x);
			const y = Math.min(this.startY, e.y);
			const w = Math.abs(e.x - this.startX);
			const h = Math.abs(e.y - this.startY);
			if (finish) {
				this.groupBuilder.clearShapes();
				this.rectangleBuilder = undefined;
				this.onSelect(x, y, w, h, this.mode);
			} else {
				this.rectangleBuilder.setRect(x, y, w, h);
			}
		}
	}
}

export abstract class AbstractDrawTool implements Tool {

	readonly requiresLocalCoordinates = true;
	readonly selectionPivotVisible = false;

	private startX = 0;
	private startY = 0;

	get cursor(): string { return 'crosshair'; }

	constructor(protected readonly viewService: ViewService) { }

	abstract cleanUp(): void;

	abstract createPropertiesComponent(container: ViewContainerRef): ComponentRef<any> | undefined;

	getHint(textService: TextService): string {
		return textService.get('toolHint.draw');
	}

	mouseDown(e: ToolMouseEvent): boolean {
		if (this.viewService.snapToGrid) {
			const gs = this.viewService.gridSize;
			this.startX = Math.round(e.x / gs) * gs;
			this.startY = Math.round(e.y / gs) * gs;
		} else {
			this.startX = e.x;
			this.startY = e.y;
		}
		this.onStart(this.startX, this.startY);
		return true;
	}

	mouseMove(e: ToolMouseEvent): void {
		this.processMouse(e, false);
	}

	mouseUp(e: ToolMouseEvent): void {
		this.processMouse(e, true);
	}

	mouseHover(e: ToolMouseEvent): void { }

	protected abstract onStart(x: number, y: number): void;

	protected abstract onDraw(startX: number, startY: number, targetX: number, targetY: number): void;

	protected abstract onComplete(startX: number, startY: number, targetX: number, targetY: number): void;

	protected queryAspect(): number | undefined { return undefined; }

	private processMouse(e: ToolMouseEvent, finish: boolean) {
		const aspect = this.queryAspect();
		let sx = this.startX;
		let sy = this.startY;
		let tx = e.x;
		let ty = e.y;
		if (e.shiftKey) {
			const dx = (tx - sx);
			const dy = (ty - sy);
			const d = Math.sqrt(dx * dx + dy * dy);
			let angle = (Math.atan2(dy, dx) + Math.PI * 2) * 180 / Math.PI;
			if (aspect === undefined) {
				angle = Math.round(angle / 15) * 15 * Math.PI / 180;
			} else {
				angle = (Math.round((angle + 45) / 90) * 90 - 45) * Math.PI / 180;
			}
			tx = sx + d * Math.cos(angle) * (aspect !== undefined ? aspect : 1);
			ty = sy + d * Math.sin(angle);
		} else if (this.viewService.snapToGrid) {
			const gs = this.viewService.gridSize;
			tx = Math.round(tx / gs) * gs;
			ty = Math.round(ty / gs) * gs;
		}
		if (e.ctrlKey) {
			sx = sx * 2 - tx;
			sy = sy * 2 - ty;
		}
		if (finish) {
			this.onComplete(sx, sy, tx, ty);
		} else {
			this.onDraw(sx, sy, tx, ty);
		}
	}
}

export abstract class AbstractClickTool implements Tool {

	readonly cursor = 'crosshair';
	readonly requiresLocalCoordinates = true;
	readonly selectionPivotVisible = false;

	abstract cleanUp(): void;

	abstract createPropertiesComponent(container: ViewContainerRef): ComponentRef<any> | undefined;

	abstract getHint(textService: TextService): string;

	abstract mouseDown(e: ToolMouseEvent): boolean;

	mouseMove(e: ToolMouseEvent): void { }

	mouseUp(e: ToolMouseEvent): void { }

	mouseHover(e: ToolMouseEvent): void { }
}
