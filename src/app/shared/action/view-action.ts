import { ViewService } from 'src/app/view/view.service';
import { View } from 'src/app/view/view';
import { SimpleAction } from './simple-action';
import { ActionData } from './action';

export class ViewAction extends SimpleAction<ViewService> {

	constructor(view: ViewService, data: ActionData<ViewService>) {
		super(view, data);
		view.onViewChange.subscribe({
			next: (view: View) => {
				this.update();
			}
		});
		this.update();
	}
}
