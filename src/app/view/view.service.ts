import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { View } from './view';
import { ModelService } from '../model/model.service';
import { ToolMouseEvent } from '../tools/tool-mouse-event';
import { SettingsService } from '../settings/settings.service';
import { SvgModel } from '../model/svg-model';
import { SvgBuilder } from '../model/svg-builder/svg-builder';
import { EllipseProperties, LineProperties, RectProperties, CircleProperties, ImageProperties } from '../model/properties/model-element-properties';
import { SelectionLayer } from './selection-layer';
import { Coordinate } from '../model/coordinate';
import { PathProperties } from '../model/properties/path-properties';
import { GroupModel, ShapeModel } from '../model/shape-model';

export enum ViewSelectMode {
	REPLACE, ADD, REMOVE
}

@Injectable({
	providedIn: 'root'
})
export class ViewService implements View {

	private static readonly PADDING = 100;
	private static readonly ZOOM_BIAS = 16; // zoom to fit margin

	readonly onViewChange = new Subject<View>();

	get svg(): SVGSVGElement { return this.svgBuilder.element; }

	// keep the order of initialization!
	private readonly svgBuilder = new SvgBuilder();
	private readonly globalGroupBuilder = this.svgBuilder.group();
	private readonly backgroundRectBuilder = this.globalGroupBuilder.rect(ViewService.PADDING, ViewService.PADDING, 1, 1);
	private readonly contentSvgBuilder = this.globalGroupBuilder.svg();
	private readonly borderRectBuilder = this.globalGroupBuilder.rect(ViewService.PADDING, ViewService.PADDING, 1, 1);
	readonly toolGroupBuilder = this.globalGroupBuilder.group();
	readonly measureGroupBuilder = this.globalGroupBuilder.group();
	private readonly selectionGroupBuilder = this.globalGroupBuilder.group();
	readonly selectionLayer = new SelectionLayer(this.selectionGroupBuilder, this);

	private _selectedIds: string[] = [];
	private _zoom: number = 1;
	private _width: number = 10;
	private _height: number = 10;
	private _snapToGrid: boolean = false;
	private _gridSize: number = 10;
	private _gridVisible = true;
	private _rulerVisible = true;
	private _wireframe = false;

	get areOnlyShapesFromOneGroupSelected(): boolean {
		if (this._selectedIds.length === 0) {
			return false;
		}
		const parents: Array<string | undefined> = this._selectedIds.map(id => this.modelService.getShapeParent(id)).map(p => p !== undefined ? p.id : undefined);
		return new Set<string | undefined>(parents).size === 1;
	}

	get canConvertToPath(): boolean {
		return this._selectedIds.length > 0 && this._selectedIds.every(id => this.modelService.getShapeById(id).canConvertToPath);
	}

	get canMoveSelectionBackward(): boolean {
		return this._selectedIds.length === 1 && this.modelService.canMoveShapeBackward(this._selectedIds[0]);
	}

	get canMoveSelectionForward(): boolean {
		return this._selectedIds.length === 1 && this.modelService.canMoveShapeForward(this._selectedIds[0]);
	}

	get gridSize(): number {
		return this._gridSize;
	}

	set gridSize(s: number) {
		if (this._gridSize !== s) {
			this._gridSize = s;
			this.settingsService.merge(settings => settings.grid.size = s);
			this.onViewChange.next(this);
		}
	}

	get gridVisible(): boolean {
		return this._gridVisible;
	}

	set gridVisible(v: boolean) {
		if (this._gridVisible !== v) {
			this._gridVisible = v;
			this.settingsService.merge(settings => settings.grid.visible = v);
			this.onViewChange.next(this);
		}
	}

	get isAnyShapeSelected(): boolean {
		return this._selectedIds.length > 0;
	}

	get isSingleGroupSelected(): boolean {
		if (this._selectedIds.length !== 1) {
			return false;
		}
		return this._selectedIds.every(id => this.modelService.isGroup(id));
	}

	get isSingleShapeSelected(): boolean {
		return this._selectedIds.length === 1;
	}

	get rulerVisible(): boolean {
		return this._rulerVisible;
	}

	set rulerVisible(v: boolean) {
		if (this._rulerVisible !== v) {
			this._rulerVisible = v;
			this.settingsService.merge(settings => settings.view.rulers = v);
			this.onViewChange.next(this);
		}
	}

	get scrollPosition(): Coordinate {
		const parent = this.svg.parentElement as HTMLElement;
		return new Coordinate(parent.scrollLeft, parent.scrollTop);
	}

	get selectedIds(): string[] {
		return this._selectedIds.slice(0);
	}

	get snapToGrid() { return this._snapToGrid; }

	set snapToGrid(s: boolean) {
		if (this._snapToGrid !== s) {
			this._snapToGrid = s;
			this.settingsService.merge(settings => settings.grid.snap = s);
			this.onViewChange.next(this);
		}
	}

	get wireframe(): boolean { return this._wireframe; }

	set wireframe(w: boolean) {
		if (this._wireframe !== w) {
			this._wireframe = w;
			this.settingsService.merge(settings => settings.view.wireframe = w);
			this.onViewChange.next(this);
		}
	}

	get zoom(): number { return this._zoom; }

	constructor(private readonly settingsService: SettingsService, readonly modelService: ModelService) {
		this.svgBuilder.setClass('canvas');
		this._gridSize = this.settingsService.gridSize;
		this._gridVisible = this.settingsService.gridVisible;
		this._snapToGrid = this.settingsService.gridSnap;
		this._rulerVisible = this.settingsService.rulersVisible;
		this.initSvg();
		modelService.onDocumentChange.subscribe({
			next: (doc: SvgModel) => {
				this.updateSvgDocument();
			}
		});
		this.updateSvgDocument();
	}

	addCircle(properties: CircleProperties) {
		this.modelService.addCircle(this.modelService.nextId, properties, undefined, undefined);
	}

	addEllipse(properties: EllipseProperties) {
		this.modelService.addEllipse(this.modelService.nextId, properties, undefined, undefined);
	}

	addImage(properties: ImageProperties) {
		this.modelService.addImage(this.modelService.nextId, properties, undefined, undefined);
	}

	addLine(properties: LineProperties) {
		this.modelService.addLine(this.modelService.nextId, properties, undefined, undefined);
	}

	addRect(properties: RectProperties) {
		this.modelService.addRect(this.modelService.nextId, properties, undefined, undefined);
	}

	addPath(properties: PathProperties) {
		this.modelService.addPath(this.modelService.nextId, properties, undefined, undefined);
	}

	clearSelection() { this.setSelection([]); }

	convertToPath() { this.modelService.convertAllToPath([...this._selectedIds]); }

	flipSelectedH() {
		const bb = this.getSelectionBoundingBox();
		if (bb !== undefined) {
			const px = bb.x + bb.width * .5;
			this.modelService.flipAllH([...this._selectedIds], px);
		}
	}

	flipSelectedV() {
		const bb = this.getSelectionBoundingBox();
		if (bb !== undefined) {
			const py = bb.y + bb.height * .5;
			this.modelService.flipAllV([...this._selectedIds], py);
		}
	}

	getElementsByPoint(x: number, y: number, all: boolean, groups: boolean): string[] {
		const point = this.svg.createSVGPoint();
		point.x = x;
		point.y = y;
		let ret: string[] = [];
		this.getElementsContainingPoint(this.contentSvgBuilder.element, point, ret);
		if (!all && ret.length > 1) {
			ret.splice(0, ret.length - 1);
		}
		if (groups) {
			const groups = new Set<string>();
			ret = ret.filter(id => {
				const parent = this.modelService.getShapeRootParent(id);
				if (parent !== undefined) {
					groups.add(parent.id);
					return false;
				} else {
					return true;
				}
			});
			ret = [...Array.from(groups.values()), ...ret];
		}
		return ret;
	}

	getSelectionBoundingBox(): SVGRect | undefined {
		const svg = this.contentSvgBuilder.element;
		return this._selectedIds
			.map(id => svg.getElementById(id))
			.filter(e => e !== null).map(e => e as SVGGeometryElement)
			.map(e => {
				const ret = e.getBBox({ stroke: true });
				return ret;
			})
			.reduce((prev: SVGRect | undefined, cur: SVGRect) => {
				if (prev === undefined) {
					return cur;
				} else {
					const minX = Math.min(prev.x, cur.x);
					const minY = Math.min(prev.y, cur.y);
					prev.width = Math.max(prev.x + prev.width, cur.x + cur.width) - minX;
					prev.height = Math.max(prev.y + prev.height, cur.y + cur.height) - minY;
					prev.x = minX;
					prev.y = minY;
					return prev;
				}
			}, undefined);
	}

	getSelectedShapes(): ShapeModel[] { return this._selectedIds.map(id => this.modelService.getShapeById(id)); }

	getSelectedTransformableIds(): string[] { return this.modelService.getTransformableShapes(this._selectedIds); }

	groupSelected() {
		if (this._selectedIds.length > 0) {
			const sel = [...this._selectedIds];
			this._selectedIds = [];
			const groupId = this.modelService.groupElements(sel);
			this.setSelection([groupId]);
		}
	}

	invertSelection() {
		throw new Error('Not implemented yet');
	}

	mouseEventToToolMouseEvent(ev: PointerEvent, x: number, y: number): ToolMouseEvent {
		return {
			altKey: ev.altKey,
			ctrlKey: ev.ctrlKey,
			shiftKey: ev.shiftKey,
			x: x / this._zoom - ViewService.PADDING,
			y: y / this._zoom - ViewService.PADDING
		};
	}

	moveSelectedBackward() {
		if (this._selectedIds.length === 1) {
			const id = this._selectedIds[0];
			const z = this.modelService.getShapeZIndex(id);
			if (z > 0) {
				this.modelService.moveShapeToZIndex(id, z - 1);
			}
		}
	}

	moveSelectedForward() {
		if (this._selectedIds.length === 1) {
			const id = this._selectedIds[0];
			const z = this.modelService.getShapeZIndex(id);
			if (this.modelService.canMoveShapeForward(id)) {
				this.modelService.moveShapeToZIndex(id, z + 1);
			}
		}
	}

	moveSelectedToBottom() {
		if (this._selectedIds.length === 1) {
			this.modelService.moveShapeToZIndex(this._selectedIds[0], 0);
		}
	}

	moveSelectedToTop() {
		if (this._selectedIds.length === 1) {
			const id = this._selectedIds[0];
			this.modelService.moveShapeToZIndex(id, this.modelService.getShapeMaxZIndex(id));
		}
	}

	removeSelectedShapes() {
		if (this._selectedIds.length > 0) {
			const ids = [...this._selectedIds];
			this._selectedIds = [];
			this.modelService.removeAllShapes(ids);
		}
	}

	rotateSelected(deg: number, px: number, py: number) {
		this.modelService.rotateAll([...this._selectedIds], deg, px, py);
	}

	scaleSelected(sx: number, sy: number, px: number, py: number) {
		this.modelService.scaleAll([...this._selectedIds], sx, sy, px, py);
	}

	scrollTo(x: number, y: number) {
		const parent = this.svg.parentElement as HTMLElement;
		parent.scrollTo(x, y);
	}

	selectAll() { this.setSelection(this.modelService.getTopLevelShapeIds()); }

	selectByPoint(x: number, y: number, mode: ViewSelectMode, all: boolean, groups: boolean) {
		const sel = this.getElementsByPoint(x, y, all, groups);
		this.combineSelection(sel, mode);
	}

	selectByRectangle(x: number, y: number, width: number, height: number, mode: ViewSelectMode) {
		const rect = this.svg.createSVGRect();
		rect.x = x + ViewService.PADDING;
		rect.y = y + ViewService.PADDING;
		rect.width = width;
		rect.height = height;
		const sel = Array.from(this.contentSvgBuilder.element.getEnclosureList(rect, this.contentSvgBuilder.element)).filter(e => e.id !== '').map(e => e.id);
		this.combineSelection(sel, mode);
	}

	setEditModeCurrentTranslation(dx: number, dy: number) {
		this.toolGroupBuilder.setAttribute('transform', `translate(${ViewService.PADDING + dx}, ${ViewService.PADDING + dy})`);
		this.selectionGroupBuilder.setAttribute('transform', `translate(${ViewService.PADDING + dx}, ${ViewService.PADDING + dy})`);
	}

	setEditModeCurrentRotation(deg: number, px: number, py: number) {
		this.toolGroupBuilder.setAttribute('transform', `translate(${ViewService.PADDING}, ${ViewService.PADDING}) rotate(${deg} ${px} ${py})`);
		this.selectionGroupBuilder.setAttribute('transform', `translate(${ViewService.PADDING}, ${ViewService.PADDING}) rotate(${deg} ${px} ${py})`);
	}

	setEditModeCurrentScale(sx: number, sy: number, px: number, py: number) {
		this.toolGroupBuilder.setAttribute('transform', `translate(${ViewService.PADDING + px}, ${ViewService.PADDING + py}) scale(${sx}, ${sy}) translate(${-px}, ${-py})`);
		this.selectionGroupBuilder.setAttribute('transform', `translate(${ViewService.PADDING + px}, ${ViewService.PADDING + py}) scale(${sx}, ${sy}) translate(${-px}, ${-py})`);
	}

	setZoom(factor: number) {
		if (factor > 0) {
			const parent = this.svg.parentElement as HTMLElement;
			const cx = (parent.scrollLeft + parent.clientWidth * .5) / this._zoom - ViewService.PADDING;
			const cy = (parent.scrollTop + parent.clientHeight * .5) / this._zoom - ViewService.PADDING;
			this.zoomAtCenter(factor, cx, cy);
		}
	}

	translateSelected(dx: number, dy: number) {
		this.modelService.translateAll([...this._selectedIds], dx, dy);
	}

	ungroupSelected() {
		if (this._selectedIds.length === 1) {
			const groupId = this._selectedIds[0];
			const group = this.modelService.getShapeById(groupId);
			this._selectedIds = (group as any as GroupModel).getTopLevelShapes().map(it => it.id);
			this.modelService.ungroupElements(groupId);
		}
	}

	zoomToFitRectangle(x: number, y: number, width: number, height: number, zoomIn: boolean) {
		if (width > 0 && height > 0) {
			const parent = this.svg.parentElement as HTMLElement;
			if (zoomIn) {
				const f1 = (parent.clientWidth - ViewService.ZOOM_BIAS) / width;
				const f2 = (parent.clientHeight - ViewService.ZOOM_BIAS) / height;
				this.zoomAtCenter(Math.min(f1, f2), x + width * .5, y + height * .5);
			} else {
				this.zoomAtCenter(this._zoom * .7, x + width * .5, y + height * .5);
			}
		}
	}

	zoomToFitSelection() {
		const boundingBox = this.getSelectionBoundingBox();
		if (boundingBox !== undefined) {
			this.zoomToFitRectangle(boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height, true);
		}
	}

	zoomToFitCanvas() {
		const parent = this.svg.parentElement as HTMLElement;
		const f1 = (parent.clientWidth - ViewService.ZOOM_BIAS) / (this._width + ViewService.PADDING * 2);
		const f2 = (parent.clientHeight - ViewService.ZOOM_BIAS) / (this._height + ViewService.PADDING * 2);
		this.zoomAtCenter(Math.min(f1, f2), this._width * .5, this._height * .5);
	}

	zoomToFitContent() {
		const parent = this.svg.parentElement as HTMLElement;
		const f1 = (parent.clientWidth - ViewService.ZOOM_BIAS) / this._width;
		const f2 = (parent.clientHeight - ViewService.ZOOM_BIAS) / this._height;
		this.zoomAtCenter(Math.min(f1, f2), this._width * .5, this._height * .5);
	}

	private afterZoomOrSizeChange() {
		this.svgBuilder.setSize((this._width + ViewService.PADDING * 2) * this._zoom, (this._height + ViewService.PADDING * 2) * this._zoom);
		this.globalGroupBuilder.setAttribute('transform', `scale(${this._zoom})`);
	}

	private combineSelection(newSelection: string[], mode: ViewSelectMode) {
		if (mode === ViewSelectMode.REPLACE) {
			this.setSelection(newSelection);
		} else {
			const set = new Set<string>(this._selectedIds);
			if (mode === ViewSelectMode.ADD) {
				newSelection.forEach(id => set.add(id));
			} else {
				newSelection.forEach(id => set.delete(id));
			}
			this.setSelection(Array.from(set));
		}
	}

	private getElementsContainingPoint(root: SVGElement, point: SVGPoint, elements: string[]) {
		if (root.id !== '' && root instanceof SVGGeometryElement) {
			if (root.isPointInFill(point) || root.isPointInStroke(point)) {
				elements.push(root.id);
			}
		}
		Array.from(root.children).forEach(c => {
			this.getElementsContainingPoint(c as SVGElement, point, elements);
		});
	}

	private initSvg() {
		this.backgroundRectBuilder.setFillColor('white');
		this.backgroundRectBuilder.setStrokeColor('none');

		this.contentSvgBuilder.setPosition(ViewService.PADDING, ViewService.PADDING);

		this.toolGroupBuilder.setAttribute('transform', `translate(${ViewService.PADDING}, ${ViewService.PADDING})`);
		this.measureGroupBuilder.setAttribute('transform', `translate(${ViewService.PADDING}, ${ViewService.PADDING})`);
		this.selectionGroupBuilder.setAttribute('transform', `translate(${ViewService.PADDING}, ${ViewService.PADDING})`);

		this.borderRectBuilder.setFillColor('none');
		this.borderRectBuilder.setStrokeColor('black');
		this.borderRectBuilder.setVectorEffect('non-scaling-stroke');
	}

	private setDocumentSize(width: number, height: number) {
		if (this._width !== width || this._height !== height) {
			this._width = width;
			this._height = height;
			this.backgroundRectBuilder.setSize(this._width, this._height);
			this.borderRectBuilder.setSize(this._width, this._height);
			this.contentSvgBuilder.setSize(this._width, this._height);
			this.afterZoomOrSizeChange();
		}
	}

	private setSelection(ids: string[]) {
		this._selectedIds = ids;
		this.onViewChange.next(this);
	}

	private updateSvgDocument() {
		this.setDocumentSize(this.modelService.width, this.modelService.height);
		this.contentSvgBuilder.clearAllContent();
		this.modelService.createSvg(this.contentSvgBuilder)
		const sel = this._selectedIds.filter(id => this.modelService.hasShape(id));
		this.setSelection(sel);
	}

	private zoomAtCenter(factor: number, x: number, y: number) {
		if (this._zoom !== factor) {
			this._zoom = factor;
			this.afterZoomOrSizeChange();
			this.onViewChange.next(this);
		}
		const parent = this.svg.parentElement as HTMLElement;
		const cx = Math.round((x + ViewService.PADDING) * this._zoom - parent.clientWidth * .5);
		let cy = Math.round((y + ViewService.PADDING) * this._zoom - parent.clientHeight * .5);
		const maxX = Math.max(0, parent.scrollWidth - parent.clientWidth);
		const maxY = Math.max(0, parent.scrollHeight - parent.clientHeight);
		parent.scrollTo(Math.max(0, Math.min(cx, maxX)), Math.max(0, Math.min(cy, maxY)));
	}
}
