import { SimpleAction } from './simple-action';
import { Router } from '@angular/router';

export interface RouterActionData {
	url: string;
	group: string;
	name: string;
	tooltip?: string;
	icon?: string;
	shortcutKey?: string;
	shortcutModifiers?: number;
}

export class RouterAction extends SimpleAction<Router> {

	constructor(router: Router, data: RouterActionData) {
		super(router, {
			action: router => {
				router.navigateByUrl(data.url)
			},
			group: data.group,
			name: data.name,
			tooltip: data.tooltip,
			icon: data.icon,
			shortcutKey: data.shortcutKey,
			shortcutModifiers: data.shortcutModifiers
		});
	}
}