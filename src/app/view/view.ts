import { ToolMouseEvent } from '../tools/tool-mouse-event';
import { Coordinate } from '../model/coordinate';

export interface View {

	readonly areOnlyShapesFromOneGroupSelected: boolean;
	readonly canMoveSelectionBackward: boolean;
	readonly canMoveSelectionForward: boolean;
	readonly gridSize: number;
	readonly gridVisible: boolean;
	readonly isAnyShapeSelected: boolean;
	readonly isSingleGroupSelected: boolean;
	readonly isSingleShapeSelected: boolean;
	readonly scrollPosition: Coordinate;
	readonly selectedIds: ReadonlyArray<string>;
	readonly snapToGrid: boolean;
	readonly zoom: number;

	mouseEventToToolMouseEvent(ev: PointerEvent, x: number, y: number): ToolMouseEvent;

	getSelectionBoundingBox(): SVGRect | undefined;
}
