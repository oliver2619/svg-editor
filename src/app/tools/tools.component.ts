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

	private viewChangeSubscription: Subscription | undefined;
	private toolPropertiesComponent: ComponentRef<any> | undefined

	constructor(private readonly toolService: ToolService, private readonly changeDetectorRef: ChangeDetectorRef) { }

	ngAfterViewInit(): void {
		this.viewChangeSubscription = this.toolService.onToolChange.subscribe({
			next: (s: Tools) => {
				this.afterToolChange();
			}
		});
		this.afterToolChange();
	}

	ngOnDestroy(): void {
		if (this.viewChangeSubscription !== undefined) {
			this.viewChangeSubscription.unsubscribe();
			this.viewChangeSubscription = undefined;
		}
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
