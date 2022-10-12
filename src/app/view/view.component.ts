import { Subscription } from 'rxjs';
import { ChangeDetectionStrategy, Component, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, HostListener, OnDestroy } from '@angular/core';
import { Coordinate } from '../model/coordinate';
import { ViewService } from '../view/view.service';
import { ToolService, Tools } from '../tools/tool.service';
import { ToolMouseEvent } from '../tools/tool-mouse-event';

@Component({
	selector: 'se-view',
	templateUrl: './view.component.html',
	styleUrls: ['./view.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewComponent implements AfterViewInit, OnDestroy {

	@ViewChild('container')
	private container: ElementRef<HTMLDivElement> | undefined;

	hoverCoordinate = new Coordinate(0, 0);

	private subscription: Subscription;

	get cursor(): string {
		return this.toolService.cursor;
	}

	get needsPane(): boolean {
		return !this.toolService.requiresLocalCoordinates;
	}

	constructor(private readonly viewService: ViewService, private readonly toolService: ToolService, private readonly changeDetectorRef: ChangeDetectorRef) {
		this.subscription = this.toolService.onToolChange.subscribe({
			next: (tool: Tools) => {
				this.changeDetectorRef.markForCheck();
			}
		});
	}

	ngAfterViewInit(): void {
		if (this.container !== undefined) {
			this.container.nativeElement.appendChild(this.viewService.svg)
		}
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	onSvgPointerDown(ev: PointerEvent, local: boolean) {
		if (ev.button === 0 && this.toolService.requiresLocalCoordinates === local) {
			const tev = local ? this.viewService.mouseEventToToolMouseEvent(ev) : this.mouseEventToToolMouseEvent(ev);
			if (this.toolService.mouseDown(tev)) {
				((this.container as ElementRef<HTMLDivElement>).nativeElement).setPointerCapture(ev.pointerId);
			}
		}
	}

	onSvgPointerMove(ev: PointerEvent, local: boolean) {
		if (this.toolService.requiresLocalCoordinates === local) {
			const tev = local ? this.viewService.mouseEventToToolMouseEvent(ev) : this.mouseEventToToolMouseEvent(ev);
			if (((this.container as ElementRef<HTMLDivElement>).nativeElement).hasPointerCapture(ev.pointerId)) {
				this.toolService.mouseMove(tev);
			} else {
				this.toolService.mouseHover(tev);
			}
			this.hoverCoordinate.x = tev.x;
			this.hoverCoordinate.y = tev.y;
			this.changeDetectorRef.markForCheck();
		}
	}

	onSvgPointerUp(ev: PointerEvent, local: boolean) {
		if (this.toolService.requiresLocalCoordinates === local) {
			const target = ((this.container as ElementRef<HTMLDivElement>).nativeElement);
			if (ev.button === 0 && target.hasPointerCapture(ev.pointerId)) {
				const tev = local ? this.viewService.mouseEventToToolMouseEvent(ev) : this.mouseEventToToolMouseEvent(ev);
				this.toolService.mouseUp(tev);
				target.releasePointerCapture(ev.pointerId);
			}
		}
	}

	private mouseEventToToolMouseEvent(ev: PointerEvent): ToolMouseEvent {
		return {
			altKey: ev.altKey,
			ctrlKey: ev.ctrlKey,
			shiftKey: ev.shiftKey,
			x: ev.offsetX,
			y: ev.offsetY
		};
	}

}
