import { Subject } from 'rxjs';
import { Shortcut } from '../shortcut/shortcut';

export interface ActionData<C> {
	group?: string;
	name: string;
	tooltip?: string;
	icon?: string;
	shortcutKey?: string;
	shortcutModifiers?: number;
	action: (context: C) => any;
	enabled?: (context: C) => boolean;
	active?: (context: C) => boolean;
}

export interface Action {
	readonly onChange: Subject<Action>;
	readonly tooltip: string;
	readonly group: string | undefined;
	readonly name: string;
	readonly icon: string | undefined;
	readonly active: boolean;
	readonly enabled: boolean;
	readonly shortcut: Shortcut | undefined;

	execute(): void;
	
	matchesKeyboardEvent(ev: KeyboardEvent): boolean;
}
