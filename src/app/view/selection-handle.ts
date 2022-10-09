import { GroupBuilder } from '../model/svg-builder/group-builder';
import { ViewService } from './view.service';
import { View } from './view';
import { RectBuilder } from '../model/svg-builder/rect-builder';

export class SelectionHandle {

	private static readonly HANDLE_RADIUS = 8;

	private rect: RectBuilder | undefined;
	// private handles: CircleBuilder[] = [];

	constructor(private readonly group: GroupBuilder, private readonly viewService: ViewService) {
		this.viewService.onViewChange.subscribe({
			next: (view: View) => {
				this.updateSelectionHandle();
			}
		});
	}

	private updateSelectionHandle() {
		const bb = this.viewService.getSelectionBoundingBox();
		if (bb !== undefined) {
			const r = SelectionHandle.HANDLE_RADIUS / this.viewService.zoom;
			if (this.rect === undefined) {
				this.rect = this.group.rect(bb.x, bb.y, bb.width, bb.height);
				this.rect.setClass('selection');
				/*
				this.handles = [];
				let c = this.group.circle(bb.x, bb.y, r);
				c.setClass('transform-handle');
				this.handles.push(c);
				c = this.group.circle(bb.x + bb.width * .5, bb.y, r);
				c.setClass('transform-handle');
				this.handles.push(c);
				c = this.group.circle(bb.x + bb.width, bb.y, r);
				c.setClass('transform-handle');
				this.handles.push(c);
				c = this.group.circle(bb.x + bb.width, bb.y + bb.height * .5, r);
				c.setClass('transform-handle');
				this.handles.push(c);
				c = this.group.circle(bb.x + bb.width, bb.y + bb.height, r);
				c.setClass('transform-handle');
				this.handles.push(c);
				c = this.group.circle(bb.x + bb.width * .5, bb.y + bb.height, r);
				c.setClass('transform-handle');
				this.handles.push(c);
				c = this.group.circle(bb.x, bb.y + bb.height, r);
				c.setClass('transform-handle');
				this.handles.push(c);
				c = this.group.circle(bb.x, bb.y + bb.height * .5, r);
				c.setClass('transform-handle');
				this.handles.push(c);
				*/
			} else {
				this.rect.setRect(bb.x, bb.y, bb.width, bb.height);
				/*
				this.handles[0].setCircle(bb.x, bb.y, r);
				this.handles[1].setCircle(bb.x + bb.width * .5, bb.y, r);
				this.handles[2].setCircle(bb.x + bb.width, bb.y, r);
				this.handles[3].setCircle(bb.x + bb.width, bb.y + bb.height * .5, r);
				this.handles[4].setCircle(bb.x + bb.width, bb.y + bb.height, r);
				this.handles[5].setCircle(bb.x + bb.width * .5, bb.y + bb.height, r);
				this.handles[6].setCircle(bb.x, bb.y + bb.height, r);
				this.handles[7].setCircle(bb.x, bb.y + bb.height * .5, r);
				*/
			}
		} else {
			if (this.rect !== undefined) {
				this.group.clearShapes();
				this.rect = undefined;
				// this.handles = [];
			}
		}
	}
}