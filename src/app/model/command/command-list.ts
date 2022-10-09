import { Command } from './command';
import { MutableSvgModel } from '../svg-model';

export class CommandList {

	private readonly commands: Command[] = [];
	private cursor: number = 0;

	get canRedo(): boolean {
		return this.cursor < this.commands.length;
	}

	get canUndo(): boolean {
		return this.cursor > 0;
	}

	get maxHistorySize(): number | undefined { return this._maxHistorySize; }

	set maxHistorySize(v: number | undefined) {
		if (v !== this._maxHistorySize) {
			this._maxHistorySize = v;
			this.updateCommandHistory();
		}
	}

	constructor(private readonly doc: MutableSvgModel, private _maxHistorySize: number | undefined) { }

	run(cmd: Command) {
		if (this.cursor < this.commands.length) {
			this.commands.splice(this.cursor);
		}
		this.commands.push(cmd);
		this.cursor++;
		cmd.redo(this.doc);
		this.updateCommandHistory();
	}

	redo() {
		if (this.canRedo) {
			this.commands[this.cursor++].redo(this.doc);
		}
	}

	undo() {
		if (this.canUndo) {
			this.commands[--this.cursor].undo(this.doc);
		}
	}

	private updateCommandHistory() {
		if (this._maxHistorySize !== undefined && this.commands.length > this._maxHistorySize) {
			const count = this.commands.length - this._maxHistorySize;
			this.commands.splice(0, count);
			this.cursor -= count;
			if (this.cursor < 0) {
				this.cursor = 0;
				this.commands.splice(0);
			}
		}
	}
}
