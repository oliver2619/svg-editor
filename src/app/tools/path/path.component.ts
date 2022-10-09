import { ChangeDetectionStrategy, Component, ViewContainerRef, ComponentRef, EventEmitter, ViewChild } from '@angular/core';
import { Tool } from '../tool';
import { TextService } from 'src/app/shared/text/text.service';
import { ToolMouseEvent } from '../tool-mouse-event';
import { ViewService } from 'src/app/view/view.service';
import { ShapePropertiesComponent } from 'src/app/shape-properties/shape-properties.component';
import { GroupBuilder } from 'src/app/model/svg-builder/group-builder';
import { PathBuilder } from 'src/app/model/svg-builder/path-builder';
import { PathCmdProperties, PathCmdMoveProperties, PathCmdLineToProperties, PathCmdCloseProperties, PathCmdContinueQuadCurveToProperties } from 'src/app/model/path-properties';

export class PathTool implements Tool {

	readonly cursor = 'crosshair';
	readonly requiresLocalCoordinates = true;

	private readonly group: GroupBuilder;
	private path: PathCmdProperties[] | undefined;
	private pathBuilder: PathBuilder | undefined;
	private propertiesComponent: PathComponent | undefined;

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
			this.pathBuilder.path.moveTo(px, py);
			const cmd: PathCmdMoveProperties = { cmd: 'M', x: px, y: py };
			this.path = [cmd];
		} else {
			if (e.ctrlKey === true && e.shiftKey === false) {
				this.pathBuilder.path.continueQuadraticCurveTo(px, py);
				const cmd: PathCmdContinueQuadCurveToProperties = { cmd: 'T', x: px, y: py };
				(<PathCmdProperties[]>this.path).push(cmd);
			} else if (e.ctrlKey === false && e.shiftKey === true) {
				this.pathBuilder.path.moveTo(px, py);
				const cmd: PathCmdMoveProperties = { cmd: 'M', x: px, y: py };
				(<PathCmdProperties[]>this.path).push(cmd);
			} else if (e.ctrlKey === false && e.shiftKey === false) {
				this.pathBuilder.path.lineTo(px, py);
				const cmd: PathCmdLineToProperties = { cmd: 'L', x: px, y: py };
				(<PathCmdProperties[]>this.path).push(cmd);
			}
		}
		return false;
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

	constructor() { }

	close() {
		this.onFinish.emit(true);
	}

	finish() {
		this.onFinish.emit(false);
	}
}
