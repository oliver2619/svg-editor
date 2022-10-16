import { Subscription } from 'rxjs';
import { ChangeDetectionStrategy, Component, ViewContainerRef, ViewChild, OnDestroy, AfterViewInit, ComponentRef, ChangeDetectorRef } from '@angular/core';
import { ToolService, Tools } from './tool.service';

@Component({
	selector: 'se-tools',
	templateUrl: './tools.component.html',
	styleUrls: ['./tools.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolsComponent implements AfterViewInit, OnDestroy {

	@ViewChild('properties', { read: ViewContainerRef })
	propertiesContainer: ViewContainerRef | undefined;

	private viewChangeSubscription: Subscription;
	private toolPropertiesComponent: ComponentRef<any> | undefined

	constructor(private readonly toolService: ToolService, private readonly changeDetectorRef: ChangeDetectorRef) {
		this.viewChangeSubscription = this.toolService.onToolChange.subscribe({
			next: (s: Tools) => {
				this.afterToolChange();
			}
		});
	}

	ngAfterViewInit(): void {
		window.setTimeout(() => {
			this.afterToolChange();
		}, 1);
	}

	ngOnDestroy(): void {
		this.viewChangeSubscription.unsubscribe();
	}

	private afterToolChange() {
		if (this.toolPropertiesComponent !== undefined) {
			this.toolPropertiesComponent.destroy();
			this.toolPropertiesComponent = undefined;
		}
		if (this.propertiesContainer !== undefined) {
			this.toolPropertiesComponent = this.toolService.current.createPropertiesComponent(this.propertiesContainer);
			this.changeDetectorRef.markForCheck();
		}
	}
}
