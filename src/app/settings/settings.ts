import { Coordinate } from '../model/coordinate';

export interface Settings {

	readonly currentTool: string;
	
	readonly gridSize: number;

	readonly gridSnap: boolean;

	readonly gridVisible: boolean;

	readonly newImageSize: Coordinate;

	readonly rulersVisible: boolean;

	readonly uiSize: string;

	readonly undoHistorySize: number | undefined;
}