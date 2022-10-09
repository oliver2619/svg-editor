import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { LocalStorageService } from '../local-storage.service';
import { SettingsJson, ShapeSettingsJson } from './settings-json';
import { Settings } from './settings';
import { Coordinate } from '../model/coordinate';
import { ColorType } from '../model/color/color';
import { Utils } from '../utils';

@Injectable({
	providedIn: 'root'
})
export class SettingsService implements Settings {

	private static readonly KEY = 'settings';

	readonly onChange = new Subject<Settings>();

	private json: SettingsJson;

	get currentShape(): ShapeSettingsJson { return Utils.deepCopy(this.json.tools.currentShape); }

	get currentTool(): string { return this.json.tools.currentTool; }

	get gridSize(): number { return this.json.grid.size; }

	get gridSnap(): boolean { return this.json.grid.snap; }

	get gridVisible(): boolean { return this.json.grid.visible; }

	get newImageSize(): Coordinate { return new Coordinate(this.json.newImage.width, this.json.newImage.height); }

	get rulersVisible(): boolean { return this.json.view.rulers; }

	get uiSize(): string { return this.json.view.uiSize; }

	get undoHistorySize(): number | undefined { return this.json.global.undoHistorySize; }

	constructor(private readonly localStorageService: LocalStorageService) {
		const json = this.localStorageService.load<SettingsJson>(SettingsService.KEY);
		if (json !== undefined) {
			this.json = json;
		} else {
			this.json = this.getInitialSettings();
		}
	}

	merge(merger: (settingsJson: SettingsJson) => void) {
		merger(this.json);
		this.save(this.json);
		this.onChange.next(this);
	}

	private save(settingsJson: SettingsJson) {
		this.localStorageService.save(SettingsService.KEY, settingsJson);
	}

	private getInitialSettings(): SettingsJson {
		return {
			grid: {
				visible: false,
				size: 10,
				snap: false
			},
			newImage: {
				width: 1024,
				height: 768
			},
			tools: {
				currentTool: 'select',
				currentShape: {
					dashArray: [],
					fill: {
						type: ColorType.CONTEXT
					},
					lineCap: 'butt',
					lineJoin: 'arcs',
					opacity: 1,
					stroke: {
						type: ColorType.CONTEXT
					},
					strokeWidth: 1,
					vectorEffect: 'none'
				},
				toolData: {}
			},
			version: 1,
			view: {
				rulers: false,
				uiSize: 'medium',
				wireframe: false
			},
			global: {
				undoHistorySize: 10
			}
		};
	}
}
