import { GroupBuilder } from '../model/svg-builder/group-builder';
import { ViewService } from './view.service';
import { View } from './view';
import { RectBuilder } from '../model/svg-builder/rect-builder';
import { CircleBuilder } from '../model/svg-builder/circle-builder';

export class SelectionLayer {

	private static readonly HANDLE_RADIUS = 8;

	private boundingBox: RectBuilder | undefined;
	private pivot: CircleBuilder | undefined;
	private _pivotVisible = false;
	// private handles: CircleBuilder[] = [];

	set pivotVisible(v: boolean) {
		if (this._pivotVisible !== v) {
			this._pivotVisible = v;
			this.updateVisibility();
		}
	}

	constructor(private readonly group: GroupBuilder, private readonly viewService: ViewService) {
		this.viewService.onViewChange.subscribe({
			next: (view: View) => {
				this.updateSvg();
				this.updateVisibility();
			}
		});
	}

	private updateVisibility() {
		if (this.pivot !== undefined) {
			this.pivot.setOpacity(this._pivotVisible ? 1 : 0);
		}
	}

	private updateSvg() {
		const bb = this.viewService.getSelectionBoundingBox();
		if (bb !== undefined) {
			const r = SelectionLayer.HANDLE_RADIUS / this.viewService.zoom;
			if (this.boundingBox === undefined) {
				this.boundingBox = this.group.rect(bb.x, bb.y, bb.width, bb.height);
				this.boundingBox.setClass('selection');
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
				this.boundingBox.setRect(bb.x, bb.y, bb.width, bb.height);
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
			if (this.pivot === undefined) {
				this.pivot = this.group.circle(bb.x + bb.width * .5, bb.y + bb.height * .5, r * .5);
				this.pivot.setClass('pivot');
			} else {
				this.pivot.setCircle(bb.x + bb.width * .5, bb.y + bb.height * .5, r * .5);
			}
		} else {
			if (this.boundingBox !== undefined) {
				this.group.clearShapes();
				this.boundingBox = undefined;
				this.pivot = undefined;
				// this.handles = [];
			}
		}
	}
}