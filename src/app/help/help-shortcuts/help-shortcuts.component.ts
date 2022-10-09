import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActionService } from 'src/app/shared/action/action.service';
import { TextService } from 'src/app/shared/text/text.service';
import { Shortcut } from 'src/app/shared/shortcut/shortcut';
import { Action } from 'src/app/shared/action/action';

interface Element {
	name: string;
	shortcut: string;
}

interface Group {
	name: string;
	elements: Element[];
}

@Component({
	selector: 'se-help-shortcuts',
	templateUrl: './help-shortcuts.component.html',
	styleUrls: ['./help-shortcuts.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HelpShortcutsComponent {

	readonly groups: Group[];

	constructor(private readonly router: Router, actionService: ActionService, textService: TextService) {
		const groupsByName = new Map<string | undefined, Action[]>();
		actionService
			.getAll()
			.filter(action => action.shortcut !== undefined)
			.forEach(action => {
				let g = groupsByName.get(action.group);
				if(g === undefined) {
					g = [];
					groupsByName.set(action.group, g);
				}
				g.push(action);
			});
		this.groups = Array.from(groupsByName.entries()).map(e => {
			const ret: Group = {
				name: e[0] !== undefined ? e[0] : '',
				elements: e[1].map(a => {
					const ret: Element = {
						name: a.name,
						shortcut: (a.shortcut as Shortcut).getHelp(textService)
					};
					return ret;
				}).sort((a1, a2) => a1.name.localeCompare(a2.name))
			};
			return ret;
		}).sort((g1, g2) => g1.name.localeCompare(g2.name));
	}

	close() {
		this.router.navigateByUrl('/');
	}
}
