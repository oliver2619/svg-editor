import { Subscription } from 'rxjs';
import { ChangeDetectionStrategy, Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { ModelService } from '../model/model.service';
import { SvgModel } from '../model/svg-model';
import { SvgBuilder } from '../model/svg-builder/svg-builder';

@Component({
	selector: 'se-miniview',
	templateUrl: './miniview.component.html',
	styleUrls: ['./miniview.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MiniviewComponent implements AfterViewInit, OnDestroy {

	private static readonly MAX_WIDTH = 200;
	private static readonly MAX_HEIGHT = 100;
	
	@ViewChild('svg')
	private svg: ElementRef<SVGSVGElement> | undefined;

	private modelServiceSubscription: Subscription | undefined;

	constructor(private readonly modelService: ModelService) {
		this.modelServiceSubscription = modelService.onDocumentChange.subscribe({
			next: (doc: SvgModel) => {
				this.updateSvg();
			}
		});
	}

	ngAfterViewInit(): void {
		this.updateSvg();
	}

	ngOnDestroy(): void {
		if (this.modelServiceSubscription !== undefined) {
			this.modelServiceSubscription.unsubscribe();
		}
	}

	private updateSvg() {
		if (this.svg !== undefined) {
			const svg = new SvgBuilder(this.svg.nativeElement);
			svg.clearAllContent();
			const width = this.modelService.width;
			const height = this.modelService.height;
			let f: number = 0;
			if (width > height * MiniviewComponent.MAX_WIDTH / MiniviewComponent.MAX_HEIGHT) {
				svg.setSize(MiniviewComponent.MAX_WIDTH, height * MiniviewComponent.MAX_WIDTH / width);
				f = MiniviewComponent.MAX_WIDTH / width;
			} else {
				svg.setSize(width * MiniviewComponent.MAX_HEIGHT / height, MiniviewComponent.MAX_HEIGHT);
				f = MiniviewComponent.MAX_HEIGHT / height;
			}
			const group = svg.group();
			group.setAttribute('transform', `scale(${f} ${f})`);
			const content = group.svg();
			this.modelService.createSvg(content);
		}
	}
}
