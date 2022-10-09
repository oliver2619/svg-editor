import { SimpleAction } from './simple-action';
import { ModelService } from 'src/app/model/model.service';
import { ActionData } from './action';
import { SvgModel } from 'src/app/model/svg-model';

export class ModelAction extends SimpleAction<ModelService> {

	constructor(document: ModelService, data: ActionData<ModelService>) {
		super(document, data);
		document.onDocumentChange.subscribe({
			next: (doc: SvgModel) => {
				this.update();
			}
		});
		this.update();
	}
}
