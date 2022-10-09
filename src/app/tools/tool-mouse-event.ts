export class ToolMouseEvent {

	constructor(
		public readonly x: number,
		public readonly y: number,
		public readonly ctrlKey: boolean,
		public readonly shiftKey: boolean,
		public readonly altKey: boolean
	) { }


}