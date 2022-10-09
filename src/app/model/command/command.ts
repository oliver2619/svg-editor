import { MutableSvgModel } from '../svg-model';

export interface Command {

	redo(doc: MutableSvgModel): void;

	undo(doc: MutableSvgModel): void;
}

export abstract class ToggleCommand implements Command {

	abstract redo(doc: MutableSvgModel): void;

	undo(doc: MutableSvgModel): void {
		this.redo(doc);
	}
}

export class MultiCommand implements Command {

	private readonly commands: Command[];

	constructor(commands?: Command[]) {
		this.commands = commands !== undefined ? [...commands] : [];
	}

	add(cmd: Command) {
		this.commands.push(cmd);
	}

	redo(doc: MutableSvgModel): void {
		this.commands.forEach(c => c.redo(doc));
	}

	undo(doc: MutableSvgModel): void {
		for (let i = this.commands.length - 1; i >= 0; --i) {
			this.commands[i].undo(doc);
		}
	}
}

export class ReverseCommand implements Command {

	constructor(private readonly command: Command) { }

	redo(doc: MutableSvgModel): void {
		this.command.undo(doc);
	}

	undo(doc: MutableSvgModel): void {
		this.command.redo(doc);
	}
}