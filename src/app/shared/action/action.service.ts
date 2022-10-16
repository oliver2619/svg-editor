import { Injectable } from '@angular/core';
import { Action } from './action';
import { TextService } from '../text/text.service';
import { ViewService } from 'src/app/view/view.service';
import { Router } from '@angular/router';
import { ToolService } from 'src/app/tools/tool.service';
import { ModelService } from 'src/app/model/model.service';
import { SimpleAction } from './simple-action';
import { ViewAction } from './view-action';
import { ModelAction } from './model-action';
import { ToolAction } from './tool-action';
import { Shortcut } from '../shortcut/shortcut';
import { RouterAction } from './router-action';

@Injectable({
	providedIn: 'root'
})
export class ActionService {

	private readonly actions: { [key: string]: Action } = {
		'document.download': new SimpleAction(this.router, {
			action: router => router.navigateByUrl('/download'),
			group: this.textService.get('document'),
			name: this.textService.get('document.download'),
			icon: 'icons/download.png',
			shortcutKey: 'key:S',
			shortcutModifiers: Shortcut.CTRL
		}),
		'document.importSvg': new SimpleAction(this.router, {
			action: router => router.navigateByUrl('/importSvg'),
			group: this.textService.get('document'),
			name: this.textService.get('document.importSvg'),
			icon: 'icons/document_import.png',
			shortcutKey: 'key:O',
			shortcutModifiers: Shortcut.CTRL
		}),
		'document.new': new SimpleAction(this.router, {
			action: router => router.navigateByUrl('/newDocument'),
			group: this.textService.get('document'),
			name: this.textService.get('document.new'),
			icon: 'icons/document_empty.png',
			shortcutKey: 'key:N',
			shortcutModifiers: Shortcut.CTRL
		}),
		'document.properties': new SimpleAction(this.router, {
			action: router => router.navigateByUrl('/documentProperties'),
			group: this.textService.get('document'),
			name: this.textService.get('document.properties'),
			icon: 'icons/tag_green.png',
			shortcutKey: 'code:Enter',
			shortcutModifiers: Shortcut.ALT
		}),
		'edit.convertToPath': new ViewAction(this.viewService, {
			action: view => view.convertToPath(),
			enabled: view => view.canConvertToPath,
			group: this.textService.get('edit'),
			name: this.textService.get('edit.convertToPath'),
			icon: 'icons/draw_vertex.png'
		}),
		'edit.delete': new ViewAction(this.viewService, {
			action: view => view.removeSelectedShapes(),
			enabled: view => view.isAnyShapeSelected,
			group: this.textService.get('edit'),
			name: this.textService.get('edit.delete'),
			icon: 'icons/draw_eraser.png',
			shortcutKey: 'code:Delete',
			shortcutModifiers: 0
		}),
		'edit.duplicate': new ViewAction(this.viewService, {
			action: view => { },
			enabled: view => view.isAnyShapeSelected,
			group: this.textService.get('edit'),
			name: this.textService.get('edit.duplicate'),
			icon: 'icons/draw_clone.png'
		}),
		'edit.flip.horizontally': new ViewAction(this.viewService, {
			action: view => view.flipSelectedH(),
			enabled: view => view.isAnyShapeSelected,
			group: this.textService.get('edit'),
			name: this.textService.get('edit.flip.horizontally'),
			icon: 'icons/shape_flip_horizontal.png'
		}),
		'edit.flip.vertically': new ViewAction(this.viewService, {
			action: view => view.flipSelectedV(),
			enabled: view => view.isAnyShapeSelected,
			group: this.textService.get('edit'),
			name: this.textService.get('edit.flip.vertically'),
			icon: 'icons/shape_flip_vertical.png'
		}),
		'edit.group': new ViewAction(this.viewService, {
			action: view => view.groupSelected(),
			enabled: view => view.areOnlyShapesFromOneGroupSelected && view.selectedIds.length > 1,
			group: this.textService.get('edit'),
			name: this.textService.get('edit.group'),
			icon: 'icons/shape_group.png',
			shortcutKey: 'key:G',
			shortcutModifiers: Shortcut.CTRL
		}),
		'edit.redo': new ModelAction(this.modelService, {
			action: model => model.redo(),
			enabled: model => model.canRedo,
			group: this.textService.get('edit'),
			name: this.textService.get('edit.redo'),
			icon: 'icons/redo.png',
			shortcutKey: 'key:Y',
			shortcutModifiers: Shortcut.CTRL
		}),
		'edit.settings': new SimpleAction(this.router, {
			action: router => router.navigateByUrl('/settings'),
			group: this.textService.get('edit'),
			name: this.textService.get('edit.settings'),
			icon: 'icons/wrench.png'
		}),
		'edit.undo': new ModelAction(this.modelService, {
			action: model => model.undo(),
			enabled: model => model.canUndo,
			group: this.textService.get('edit'),
			name: this.textService.get('edit.undo'),
			icon: 'icons/undo.png',
			shortcutKey: 'key:Z',
			shortcutModifiers: Shortcut.CTRL
		}),
		'edit.ungroup': new ViewAction(this.viewService, {
			action: view => view.ungroupSelected(),
			enabled: view => view.isSingleGroupSelected,
			group: this.textService.get('edit'),
			name: this.textService.get('edit.ungroup'),
			icon: 'icons/shape_ungroup.png',
			shortcutKey: 'key:G',
			shortcutModifiers: Shortcut.CTRL | Shortcut.SHIFT
		}),
		'edit.z.bottom': new ViewAction(this.viewService, {
			action: view => view.moveSelectedToBottom(),
			enabled: view => view.canMoveSelectionBackward,
			group: this.textService.get('edit'),
			name: this.textService.get('edit.z.bottom'),
			icon: 'icons/shape_move_back.png',
			shortcutKey: 'code:PageDown',
			shortcutModifiers: Shortcut.CTRL | Shortcut.SHIFT
		}),
		'edit.z.backwards': new ViewAction(this.viewService, {
			action: view => view.moveSelectedBackward(),
			enabled: view => view.canMoveSelectionBackward,
			group: this.textService.get('edit'),
			name: this.textService.get('edit.z.backwards'),
			icon: 'icons/shape_move_backwards.png',
			shortcutKey: 'code:PageDown',
			shortcutModifiers: Shortcut.CTRL
		}),
		'edit.z.forwards': new ViewAction(this.viewService, {
			action: view => view.moveSelectedForward(),
			enabled: view => view.canMoveSelectionForward,
			group: this.textService.get('edit'),
			name: this.textService.get('edit.z.forwards'),
			icon: 'icons/shape_move_forwards.png',
			shortcutKey: 'code:PageUp',
			shortcutModifiers: Shortcut.CTRL
		}),
		'edit.z.top': new ViewAction(this.viewService, {
			action: view => view.moveSelectedToTop(),
			enabled: view => view.canMoveSelectionForward,
			group: this.textService.get('edit'),
			name: this.textService.get('edit.z.top'),
			icon: 'icons/shape_move_front.png',
			shortcutKey: 'code:PageUp',
			shortcutModifiers: Shortcut.CTRL | Shortcut.SHIFT
		}),
		'help.about': new RouterAction(this.router, {
			url: '/help/about',
			group: this.textService.get('help'),
			name: this.textService.get('help.about')
		}),
		'help.shortcuts': new RouterAction(this.router, {
			url: '/help/shortcuts',
			group: this.textService.get('help'),
			name: this.textService.get('help.shortcuts'),
			shortcutKey: 'code:F1',
			shortcutModifiers: 0
		}),
		'image.fitToContent': new ModelAction(this.modelService, {
			action: model => { },
			group: this.textService.get('image'),
			name: this.textService.get('image.fitToContent')
		}),
		'image.adjustSize': new SimpleAction(this.router, {
			action: router => router.navigateByUrl('/imageAdjustSize'),
			group: this.textService.get('image'),
			name: this.textService.get('image.adjustSize')
		}),
		'selection.all': new ViewAction(this.viewService, {
			action: view => view.selectAll(),
			group: this.textService.get('selection'),
			name: this.textService.get('selection.all'),
			shortcutKey: 'key:A',
			shortcutModifiers: Shortcut.CTRL
		}),
		'selection.clear': new ViewAction(this.viewService, {
			action: view => view.clearSelection(),
			enabled: view => view.isAnyShapeSelected,
			group: this.textService.get('selection'),
			name: this.textService.get('selection.clear'),
			shortcutKey: 'key:A',
			shortcutModifiers: Shortcut.CTRL | Shortcut.SHIFT
		}),
		'selection.invert': new ViewAction(this.viewService, {
			action: view => view.invertSelection(),
			enabled: view => false,
			group: this.textService.get('selection'),
			name: this.textService.get('selection.invert'),
			icon: 'icons/select_invert.png',
			shortcutKey: 'key:I',
			shortcutModifiers: Shortcut.CTRL | Shortcut.SHIFT
		}),
		'tool.circle': new ToolAction(this.toolService, {
			tool: this.toolService.get('circle'),
			group: this.textService.get('tools'),
			name: this.textService.get('tool.circle'),
			icon: 'icons/draw_circle.png',
			shortcutKey: 'key:C',
			shortcutModifiers: Shortcut.SHIFT
		}),
		'tool.crop': new ToolAction(this.toolService, {
			tool: this.toolService.get('crop'),
			group: this.textService.get('tools'),
			name: this.textService.get('tool.crop'),
			icon: 'icons/transform_crop.png'
		}),
		'tool.ellipse': new ToolAction(this.toolService, {
			tool: this.toolService.get('ellipse'),
			group: this.textService.get('tools'),
			name: this.textService.get('tool.ellipse'),
			icon: 'icons/draw_ellipse.png',
			shortcutKey: 'key:E',
			shortcutModifiers: Shortcut.SHIFT
		}),
		'tool.geometry': new ToolAction(this.toolService, {
			tool: this.toolService.get('geometry'),
			group: this.textService.get('tools'),
			name: this.textService.get('tool.geometry'),
			icon: 'icons/draw_path.png'
		}),
		'tool.image': new ToolAction(this.toolService, {
			tool: this.toolService.get('image'),
			group: this.textService.get('tools'),
			name: this.textService.get('tool.image'),
			icon: 'icons/image.png',
			shortcutKey: 'key:I',
			shortcutModifiers: Shortcut.SHIFT
		}),
		'tool.library': new ToolAction(this.toolService, {
			tool: this.toolService.get('library'),
			group: this.textService.get('tools'),
			name: this.textService.get('tool.library'),
			icon: 'icons/book.png'
		}),
		'tool.line': new ToolAction(this.toolService, {
			tool: this.toolService.get('line'),
			group: this.textService.get('tools'),
			name: this.textService.get('tool.line'),
			icon: 'icons/draw_line.png',
			shortcutKey: 'key:L',
			shortcutModifiers: Shortcut.SHIFT
		}),
		'tool.measure': new ToolAction(this.toolService, {
			tool: this.toolService.get('measure'),
			group: this.textService.get('tools'),
			name: this.textService.get('tool.measure'),
			icon: 'icons/ruler.png'
		}),
		'tool.move': new ToolAction(this.toolService, {
			tool: this.toolService.get('move'),
			group: this.textService.get('tools'),
			name: this.textService.get('tool.move'),
			icon: 'icons/transform_move.png',
			shortcutKey: 'key:M',
			shortcutModifiers: 0
		}),
		'tool.panning': new ToolAction(this.toolService, {
			tool: this.toolService.get('panning'),
			group: this.textService.get('tools'),
			name: this.textService.get('tool.panning'),
			icon: 'icons/hand.png',
			shortcutKey: 'key:G',
			shortcutModifiers: 0
		}),
		'tool.path': new ToolAction(this.toolService, {
			tool: this.toolService.get('path'),
			group: this.textService.get('tools'),
			name: this.textService.get('tool.path'),
			icon: 'icons/draw_polyline.png',
			shortcutKey: 'key:P',
			shortcutModifiers: Shortcut.SHIFT
		}),
		'tool.pencil': new ToolAction(this.toolService, {
			tool: this.toolService.get('pencil'),
			group: this.textService.get('tools'),
			name: this.textService.get('tool.pencil'),
			icon: 'icons/pencil.png',
			shortcutKey: 'key:D',
			shortcutModifiers: Shortcut.SHIFT
		}),
		'tool.pipette': new ToolAction(this.toolService, {
			tool: this.toolService.get('pipette'),
			group: this.textService.get('tools'),
			name: this.textService.get('tool.pipette'),
			icon: 'icons/pipette.png'
		}),
		'tool.polygon': new ToolAction(this.toolService, {
			tool: this.toolService.get('polygon'),
			group: this.textService.get('tools'),
			name: this.textService.get('tool.polygon'),
			icon: 'icons/draw_polygon.png'
		}),
		'tool.rect': new ToolAction(this.toolService, {
			tool: this.toolService.get('rect'),
			group: this.textService.get('tools'),
			name: this.textService.get('tool.rect'),
			icon: 'icons/shape_square.png',
			shortcutKey: 'key:R',
			shortcutModifiers: Shortcut.SHIFT
		}),
		'tool.rotate': new ToolAction(this.toolService, {
			tool: this.toolService.get('rotate'),
			group: this.textService.get('tools'),
			name: this.textService.get('tool.rotate'),
			icon: 'icons/transform_rotate.png',
			shortcutKey: 'key:R',
			shortcutModifiers: 0
		}),
		'tool.scale': new ToolAction(this.toolService, {
			tool: this.toolService.get('scale'),
			group: this.textService.get('tools'),
			name: this.textService.get('tool.scale'),
			icon: 'icons/transform_scale.png',
			shortcutKey: 'key:S',
			shortcutModifiers: 0
		}),
		'tool.select': new ToolAction(this.toolService, {
			tool: this.toolService.get('select'),
			group: this.textService.get('tools'),
			name: this.textService.get('tool.select'),
			icon: 'icons/cursor.png',
			shortcutKey: 'key:E',
			shortcutModifiers: 0
		}),
		'tool.selectRect': new ToolAction(this.toolService, {
			tool: this.toolService.get('selectRect'),
			group: this.textService.get('tools'),
			name: this.textService.get('tool.selectRect'),
			icon: 'icons/select.png'
		}),
		'tool.text': new ToolAction(this.toolService, {
			tool: this.toolService.get('text'),
			group: this.textService.get('tools'),
			name: this.textService.get('tool.text'),
			icon: 'icons/text.png',
			shortcutKey: 'key:T',
			shortcutModifiers: Shortcut.SHIFT
		}),
		'tool.zoom': new ToolAction(this.toolService, {
			tool: this.toolService.get('zoom'),
			group: this.textService.get('tools'),
			name: this.textService.get('tool.zoom'),
			icon: 'icons/zoom_selection.png',
			shortcutKey: 'key:Z',
			shortcutModifiers: 0
		}),
		'view.grid.show': new ViewAction(this.viewService, {
			action: view => view.gridVisible = !view.gridVisible,
			group: this.textService.get('view'),
			name: this.textService.get('view.grid.show'),
			icon: 'icons/grid.png'
		}),
		'view.grid.size': new SimpleAction(this.router, {
			action: router => router.navigateByUrl('/gridsize'),
			group: this.textService.get('view'),
			name: this.textService.get('view.grid.size')
		}),
		'view.grid.snap': new ViewAction(this.viewService, {
			action: view => view.snapToGrid = !view.snapToGrid,
			active: view => view.snapToGrid,
			group: this.textService.get('view'),
			name: this.textService.get('view.grid.snap'),
			icon: 'icons/magnet.png'
		}),
		'view.wireframeMode': new ViewAction(this.viewService, {
			action: view => view.wireframe = !view.wireframe,
			group: this.textService.get('view'),
			name: this.textService.get('view.wireframeMode')
		}),
	};

	constructor(private textService: TextService, private readonly modelService: ModelService, private readonly viewService: ViewService, private readonly router: Router, private readonly toolService: ToolService) { }

	get(action: string): Action {
		const ret = this.actions[action];
		if (ret === undefined) {
			throw new RangeError('Action ${action} not found');
		}
		return ret;
	}

	getAll(): Action[] {
		return Object.values(this.actions);
	}

	keyDown(ev: KeyboardEvent) {
		const found = Object.values(this.actions).find(a => a.matchesKeyboardEvent(ev));
		if (found !== undefined && found.enabled) {
			found.execute();
			ev.preventDefault();
		}
	}
}
