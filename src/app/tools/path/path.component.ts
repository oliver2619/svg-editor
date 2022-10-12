import { ChangeDetectionStrategy, Component, ViewContainerRef, ComponentRef, EventEmitter, ViewChild } from '@angular/core';
import { Tool } from '../tool';
import { TextService } from 'src/app/shared/text/text.service';
import { ToolMouseEvent } from '../tool-mouse-event';
import { ViewService } from 'src/app/view/view.service';
import { ShapePropertiesComponent } from 'src/app/shape-properties/shape-properties.component';
import { GroupBuilder } from 'src/app/model/svg-builder/group-builder';
import { PathBuilder } from 'src/app/model/svg-builder/path-builder';
import { PathCmdProperties, PathCmdMoveProperties, PathCmdLineToProperties, PathCmdCloseProperties, PathCmdContinueQuadCurveToProperties } from 'src/app/model/path-properties';
import { Coordinate } from 'src/app/model/coordinate';

export class PathTool implements Tool {

	readonly cursor = 'crosshair';
	readonly requiresLocalCoordinates = true;
	readonly selectionPivotVisible = false;

	private readonly group: GroupBuilder;
	private path: PathCmdProperties[] | undefined;
	private pathBuilder: PathBuilder | undefined;
	private propertiesComponent: PathComponent | undefined;
	private hoverCoordinate = new Coordinate(0, 0);

	constructor(private readonly viewService: ViewService) {
		this.group = viewService.toolGroupBuilder;
	}

	cleanUp() {
		if (this.pathBuilder !== undefined) {
			this.group.clearShapes();
			this.pathBuilder = undefined;
		}
	}

	createPropertiesComponent(container: ViewContainerRef): ComponentRef<any> | undefined {
		const ret = container.createComponent(PathComponent);
		this.propertiesComponent = ret.instance;
		ret.instance.onFinish.subscribe({
			next: (close: boolean) => {
				if (close) {
					this.close();
				} else {
					this.finish();
				}
			}
		});
		ret.instance.onUndo.subscribe({
			next: () => this.undo()
		});
		return ret;
	}

	getHint(textService: TextService): string {
		return textService.get('tool.path.help');
	}

	mouseUp(e: ToolMouseEvent): void {
	}

	mouseMove(e: ToolMouseEvent): void {
	}

	mouseDown(e: ToolMouseEvent): boolean {
		const gs = this.viewService.gridSize;
		const px = this.viewService.snapToGrid ? Math.round(e.x / gs) * gs : e.x;
		const py = this.viewService.snapToGrid ? Math.round(e.y / gs) * gs : e.y;
		if (this.pathBuilder === undefined) {
			this.pathBuilder = this.group.path();
			this.pathBuilder.setFillColor('none');
			this.pathBuilder.setStrokeColor('black');
		}
		if (this.path === undefined || this.path.length === 0) {
			this.pathBuilder.path.moveTo(px, py);
			const cmd: PathCmdMoveProperties = { cmd: 'M', x: px, y: py };
			this.path = [cmd];
		} else {
			if (e.ctrlKey === true && e.shiftKey === false) {
				const cmd: PathCmdContinueQuadCurveToProperties = { cmd: 'T', x: px, y: py };
				this.path.push(cmd);
				this.recreatePath();
			} else if (e.ctrlKey === false && e.shiftKey === true) {
				const cmd: PathCmdMoveProperties = { cmd: 'M', x: px, y: py };
				if (this.path[this.path.length - 1].cmd === 'M') {
					this.path[this.path.length - 1] = cmd;
				} else {
					this.path.push(cmd);
				}
				this.recreatePath();
			} else if (e.ctrlKey === false && e.shiftKey === false) {
				const cmd: PathCmdLineToProperties = { cmd: 'L', x: px, y: py };
				this.path.push(cmd);
				this.recreatePath();
			}
		}
		return false;
	}

	mouseHover(e: ToolMouseEvent): void {
		this.hoverCoordinate.x = e.x;
		this.hoverCoordinate.y = e.y;
		if(this.path !== undefined && this.path.length > 0) {
			this.recreatePath();
		}
	}

	private close() {
		if (this.pathBuilder !== undefined) {
			this.pathBuilder.path.closePath();
			const cmd: PathCmdCloseProperties = { cmd: 'Z' };
			(<PathCmdProperties[]>this.path).push(cmd);
		}
	}

	private finish() {
		this.cleanUp();
		if (this.path !== undefined && this.propertiesComponent !== undefined && this.propertiesComponent.shapeProperties !== undefined) {
			this.viewService.addPath({
				...this.propertiesComponent.shapeProperties.shapeProperties,
				fill: this.propertiesComponent.shapeProperties.fillProperties,
				stroke: this.propertiesComponent.shapeProperties.strokeProperties,
				lineCap: this.propertiesComponent.shapeProperties.lineCap,
				lineJoin: this.propertiesComponent.shapeProperties.lineJoin,
				commands: this.path
			});
			this.path = undefined;
		}
	}

	private recreatePath() {
		if (this.pathBuilder !== undefined && this.path !== undefined) {
			this.pathBuilder.path.clearPath();
			this.path.forEach(c => this.pathBuilder?.path.command(c));
			this.pathBuilder.path.lineTo(this.hoverCoordinate.x, this.hoverCoordinate.y);
		}
	}

	private undo() {
		if (this.path !== undefined && this.path.length > 0) {
			this.path.pop();
			this.recreatePath();
		}
	}
}

@Component({
	selector: 'se-path',
	templateUrl: './path.component.html',
	styleUrls: ['./path.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PathComponent {

	@ViewChild('shapeProperties')
	shapeProperties: ShapePropertiesComponent | undefined;

	readonly onFinish = new EventEmitter<boolean>();
	readonly onUndo = new EventEmitter<void>();

	constructor() { }

	close() {
		this.onFinish.emit(true);
	}

	finish() {
		this.onFinish.emit(false);
	}

	undo() {
		this.onUndo.emit();
	}
}
