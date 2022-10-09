import { Subject } from 'rxjs';
import { Action, ActionData } from './action';
import { Shortcut } from '../shortcut/shortcut';

export class SimpleAction<C> implements Action {

	readonly group: string | undefined;
	readonly name: string;
	readonly tooltip: string;
	readonly icon: string | undefined;
	readonly onChange = new Subject<Action>();
	readonly shortcut: Shortcut | undefined;

	private readonly action: (context: C) => any;
	private readonly onCheckActive: ((context: C) => boolean) | undefined;
	private readonly onCheckEnabled: ((context: C) => boolean) | undefined;

	private _enabled: boolean;
	private _active: boolean;

	constructor(private readonly context: C, data: ActionData<C>) {
		this.group = data.group;
		this.name = data.name;
		this.tooltip = data.tooltip !== undefined ? data.tooltip : data.name;
		this.icon = data.icon;
		this.action = data.action;
		this.onCheckActive = data.active;
		this.onCheckEnabled = data.enabled;
		this._enabled = data.enabled !== undefined ? data.enabled(context) : true;
		this._active = data.active !== undefined ? data.active(context) : false;
		if (data.shortcutKey !== undefined) {
			this.shortcut = Shortcut.for(data.shortcutKey, data.shortcutModifiers);
		}
	}

	get active(): boolean {
		return this._active;
	}

	get enabled(): boolean {
		return this._enabled;
	}

	execute(): void {
		if (this._enabled) {
			this.action(this.context);
		}
	}

	matchesKeyboardEvent(ev: KeyboardEvent): boolean {
		return this.shortcut !== undefined && this.shortcut.matches(ev);
	}

	protected update() {
		let modified = false;
		if (this.onCheckActive !== undefined) {
			const wasActive = this._active;
			this._active = this.onCheckActive(this.context);
			modified = this._active !== wasActive;
		}
		if (this.onCheckEnabled !== undefined) {
			const wasEnabled = this._enabled;
			this._enabled = this.onCheckEnabled(this.context);
			modified = modified || this._enabled !== wasEnabled;
		}
		if (modified) {
			this.onChange.next(this);
		}
	}
}
