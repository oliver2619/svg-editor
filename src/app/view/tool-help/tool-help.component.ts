import { Subscription } from 'rxjs';
import { ChangeDetectionStrategy, Component, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ToolService, Tools } from 'src/app/tools/tool.service';
import { TextService } from 'src/app/shared/text/text.service';

@Component({
	selector: 'se-tool-help',
	templateUrl: './tool-help.component.html',
	styleUrls: ['./tool-help.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolHelpComponent implements OnDestroy {

	private toolSubscription: Subscription;

	get help(): string {
		return this.toolService.current.getHint(this.textService);
	}

	constructor(private readonly toolService: ToolService, private readonly textService: TextService, private readonly changeDetectorRef: ChangeDetectorRef) { 
		this.toolSubscription = this.toolService.onToolChange.subscribe({
			next: (tools: Tools) => {
				this.changeDetectorRef.markForCheck();
			}
		});
	}

	ngOnDestroy(): void {
		this.toolSubscription.unsubscribe();
	}
}
