import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { SettingsService } from '../settings/settings.service';
import { ChangeDocPropertiesCommand, SetSizeCommand, AddRectCommand, AddEllipseCommand, AddLineCommand, AddPolygonCommand, AddPolylineCommand, AddPathCommand, MoveShapeZIndexCommand, AddCircleCommand, AddImageCommand, TranslateShapeCommand, AddGroupCommand, MoveShapeToGroupCommand, Commands } from './command/commands';
import { MutableSvgModel, SvgModel } from './svg-model';
import { CommandList } from './command/command-list';
import { SvgModelImp } from './model-imp/model-imp';
import { SvgBuilder } from './svg-builder/svg-builder';
import { EllipseProperties, LineProperties, PolylineProperties, PolygonProperties, RectProperties, PatternProperties, GroupProperties, CircleProperties, ImageProperties } from './model-element-properties';
import { ShapeModel, GroupModel, ShapeModelType } from './shape-model';
import { PathProperties } from './path-properties';
import { MultiCommand } from './command/command';
import { SvgImporter } from './importer/svg-importer';
import { SvgModelImportBuilder } from './importer/svg-model-import-builder';

@Injectable({
	providedIn: 'root'
})
export class ModelService implements MutableSvgModel {

	readonly onDocumentChange = new Subject<SvgModel>();

	private _document: SvgModelImp;
	private _cmdList: CommandList;

	get height(): number { return this._document.height; }

	get width(): number { return this._document.width; }

	get title(): string { return this._document.title; }

	get canRedo(): boolean { return this._cmdList.canRedo; }

	get canUndo(): boolean { return this._cmdList.canUndo; }

	get maxUndoHistorySize(): number | undefined { return this._cmdList.maxHistorySize; }

	set maxUndoHistorySize(v: number | undefined) {
		if (v !== this._cmdList.maxHistorySize) {
			this._cmdList.maxHistorySize = v;
			this.settingsService.merge(json => {
				json.global.undoHistorySize = v;
			});
		}
	}

	get nextId(): string { return this._document.nextId; }

	constructor(private readonly settingsService: SettingsService) {
		this._document = new SvgModelImp(settingsService.newImageSize.x, settingsService.newImageSize.y);
		this._cmdList = new CommandList(this._document, settingsService.undoHistorySize);
	}

	addCircle(id: string, properties: CircleProperties, parent: string | undefined, zIndex: number | undefined) {
		this._cmdList.run(new AddCircleCommand(id, properties, parent, zIndex));
		this.onDocumentChange.next(this);
	}

	addEllipse(id: string, properties: EllipseProperties, parent: string | undefined, zIndex: number | undefined) {
		this._cmdList.run(new AddEllipseCommand(id, properties, parent, zIndex));
		this.onDocumentChange.next(this);
	}

	addImage(id: string, properties: ImageProperties, parent: string | undefined, zIndex: number | undefined) {
		this._cmdList.run(new AddImageCommand(id, properties, parent, zIndex));
		this.onDocumentChange.next(this);
	}

	addLine(id: string, properties: LineProperties, parent: string | undefined, zIndex: number | undefined) {
		this._cmdList.run(new AddLineCommand(id, properties, parent, zIndex));
		this.onDocumentChange.next(this);
	}

	addPath(id: string, properties: PathProperties, parent: string | undefined, zIndex: number | undefined) {
		this._cmdList.run(new AddPathCommand(id, properties, parent, zIndex));
		this.onDocumentChange.next(this);
	}

	addPolyline(id: string, properties: PolylineProperties, parent: string | undefined, zIndex: number | undefined) {
		this._cmdList.run(new AddPolylineCommand(id, properties, parent, zIndex));
		this.onDocumentChange.next(this);
	}

	addPolygon(id: string, properties: PolygonProperties, parent: string | undefined, zIndex: number | undefined) {
		this._cmdList.run(new AddPolygonCommand(id, properties, parent, zIndex));
		this.onDocumentChange.next(this);
	}

	addRect(id: string, properties: RectProperties, parent: string | undefined, zIndex: number | undefined) {
		this._cmdList.run(new AddRectCommand(id, properties, parent, zIndex));
		this.onDocumentChange.next(this);
	}

	removePattern(id: string) {
		throw new Error("Method not implemented.");
	}
	removeMarker(id: string) {
		throw new Error("Method not implemented.");
	}
	removeGradient(id: string) {
		throw new Error("Method not implemented.");
	}
	removeFilter(id: string) {
		throw new Error("Method not implemented.");
	}
	addPattern(id: string, properties: PatternProperties) {
		throw new Error("Method not implemented.");
	}
	addMarker() {
		throw new Error("Method not implemented.");
	}
	addLinearGradient() {
		throw new Error("Method not implemented.");
	}
	addFilter() {
		throw new Error("Method not implemented.");
	}
	addCircularGradient() {
		throw new Error("Method not implemented.");
	}
	addGroup(id: string, properties: GroupProperties, parent: string | undefined) {
		throw new Error("Method not implemented.");
	}
	moveShapeToGroup(shapeId: string, parent: string | undefined, zIndex: number | undefined) {
		throw new Error("Method not implemented.");
	}

	canMoveShapeBackward(id: string): boolean { return this._document.canMoveShapeBackward(id); }

	canMoveShapeForward(id: string): boolean { return this._document.canMoveShapeForward(id); }

	createSvg(builder: SvgBuilder) { this._document.createSvg(builder); }

	cropImage(x: number, y: number, width: number, height: number) {
		throw new Error("Method not implemented.");
	}

	exportSvg(): string { return this._document.exportSvg(); }

	getGroups(id: string): string[] { return this._document.getGroups(id); }

	getShapeById(id: string): ShapeModel { return this._document.getShapeById(id); }

	getShapeMaxZIndex(id: string): number { return this._document.getShapeMaxZIndex(id); }

	getShapeMnemento(id: string): any { return this._document.getShapeMnemento(id); }

	getShapeNestingDepth(id: string): number { return this._document.getShapeNestingDepth(id); }

	getShapeParent(id: string): GroupModel | undefined { return this._document.getShapeParent(id); }

	getShapeRootParent(id: string): GroupModel | undefined { return this._document.getShapeRootParent(id); }

	getShapeZIndex(id: string): number { return this._document.getShapeZIndex(id); }

	getTopLevelShapes(): ShapeModel[] { return this._document.getTopLevelShapes(); }

	getTopLevelShapeIds(): string[] { return this._document.getTopLevelShapeIds(); }

	getTransformableShapes(shapeId: string): string[] {
		return this._document.getTransformableShapes(shapeId);
	}

	groupElements(ids: string[]): string {
		const idWithZ = ids.map(id => {
			return { id: id, z: this._document.getShapeZIndex(id) };
		}).sort((s1, s2) => s1.z - s2.z);
		const minZ = idWithZ[0].z;
		const mc = new MultiCommand([]);
		const groupId = this.nextId;
		const parent = this._document.getShapeParent(idWithZ[0].id);
		mc.add(new AddGroupCommand(groupId, {
			opacity: 1,
			vectorEffect: 'none'
		}, parent !== undefined ? parent.id : undefined, minZ));
		idWithZ.map(it => it.id).forEach(id => {
			mc.add(new MoveShapeToGroupCommand(id, groupId, undefined));
		});
		this._cmdList.run(mc);
		this.onDocumentChange.next(this);
		return groupId;
	}

	hasShape(id: string): boolean { return this._document.hasShape(id); }

	importSvg(svg: string, filename: string) {
		const builder = new SvgModelImportBuilder();
		SvgImporter.importFromString(svg, builder);
		this._document = builder.getModel();
		this._document.setTitle(filename);
		this._cmdList = new CommandList(this._document, this.settingsService.undoHistorySize);
		this.onDocumentChange.next(this);
	}

	isGroup(id: string): boolean { return this._document.isGroup(id); }

	moveShapeToZIndex(shapeId: string, zIndex: number) {
		this._cmdList.run(new MoveShapeZIndexCommand(shapeId, zIndex));
		this.onDocumentChange.next(this);
	}

	newDocument(width: number, height: number, title: string): void {
		this._document = new SvgModelImp(width, height);
		this._document.setTitle(title);
		this._cmdList = new CommandList(this._document, this.settingsService.undoHistorySize);
		this.onDocumentChange.next(this);
	}

	redo(): void {
		this._cmdList.redo();
		this.onDocumentChange.next(this);
	}

	removeAllShapes(ids: string[]) {
		if (ids.length > 0) {
			const shapeCommands = Array.from(new Set<string>(ids.flatMap(id => this.getTransformableShapes(id))))
				.map(id => {
					const ret: { id: string, z: number } = { id, z: this.getShapeZIndex(id) };
					return ret;
				})
				.sort((s1, s2) => s2.z - s1.z)
				.map(s => Commands.removeShape(s.id, this));
			const groupCommands = Array.from(new Set<string>(ids.flatMap(id => this.getGroups(id))))
				.map(id => {
					const ret: { id: string, z: number, d: number } = { id, z: this.getShapeZIndex(id), d: this.getShapeNestingDepth(id) };
					return ret;
				})
				.sort((g1, g2) => g1.d !== g2.d ? g2.d - g1.d : (g2.z - g1.z))
				.map(g => Commands.removeEmptyGroup(g.id, this));
			this._cmdList.run(new MultiCommand([...shapeCommands, ...groupCommands]));
			this.onDocumentChange.next(this);
		}
	}

	removeShape(id: string) {
		throw new Error("Method not implemented.");
	}

	setShapeMnemento(id: string, m: any) {
		throw new Error("Method not implemented.");
	}

	setSize(width: number, height: number) {
		this._cmdList.run(new SetSizeCommand(width, height));
		this.onDocumentChange.next(this);
	}

	setTitle(title: string) {
		if (title !== this._document.title) {
			this._cmdList.run(new ChangeDocPropertiesCommand(title));
			this.onDocumentChange.next(this);
		}
	}

	translateAll(shapeIds: string[], dx: number, dy: number) {
		if (shapeIds.length > 0 && (dx !== 0 || dy !== 0)) {
			const shapes = Array.from(new Set<string>(shapeIds.flatMap(id => this.getTransformableShapes(id))));
			const cmds = shapes.map(id => new TranslateShapeCommand(id, dx, dy));
			this._cmdList.run(new MultiCommand(cmds));
			this.onDocumentChange.next(this);
		}
	}

	translateShape(id: string, dx: number, dy: number) {
		this._cmdList.run(new TranslateShapeCommand(id, dx, dy));
		this.onDocumentChange.next(this);
	}

	undo(): void {
		this._cmdList.undo();
		this.onDocumentChange.next(this);
	}

	ungroupElements(groupId: string) {
		const zIndex = this._document.getShapeZIndex(groupId);
		const group = this._document.getShapeById(groupId);
		if (group.type !== ShapeModelType.GROUP) {
			throw new RangeError(`Shape ${groupId} is not a group`);
		}
		const parentId = group.parentId;
		const cmd = new MultiCommand();
		(group as unknown as GroupModel).getTopLevelShapes().map(it => it.id).forEach((c, i) => {
			cmd.add(new MoveShapeToGroupCommand(c, parentId, zIndex + i));
		});
		cmd.add(Commands.removeEmptyGroup(groupId, this._document));
		this._cmdList.run(cmd);
		this.onDocumentChange.next(this);
	}
}
