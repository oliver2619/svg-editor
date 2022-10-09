import {Subscription} from 'rxjs';
import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';
import { ModelService } from '../model/model.service';
import { ShapeModel, ShapeModelType } from '../model/shape-model';

@Component({
	selector: 'se-object-tree',
	templateUrl: './object-tree.component.html',
	styleUrls: ['./object-tree.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ObjectTreeComponent {

	private modelSubscription: Subscription;
	
	get topLevelShapes(): ShapeModel[] { return this.modelService.getTopLevelShapes(); }

	constructor(private readonly modelService: ModelService, changeDetectorRef: ChangeDetectorRef) { 
		this.modelSubscription = this.modelService.onDocumentChange.subscribe({
			next: () => {
				changeDetectorRef.markForCheck();
			}
		});
	}
	
	getIcon(shape: ShapeModel): string {
		return shape.type === ShapeModelType.GROUP ? 'folder.png' : 'draw_polyline.png';
	}

}
