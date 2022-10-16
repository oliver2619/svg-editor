import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentRef, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { ShapeModel } from '../model/shape-model';
import { ViewService } from '../view/view.service';

@Component({
  selector: 'se-selection-properties',
  templateUrl: './selection-properties.component.html',
  styleUrls: ['./selection-properties.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectionPropertiesComponent implements AfterViewInit, OnDestroy {

  @ViewChild('properties', { read: ViewContainerRef })
  propertiesContainer: ViewContainerRef | undefined;

  private selectedShape: ShapeModel | undefined;

  private readonly viewChangeSubscription: Subscription;
  private propertiesComponent: ComponentRef<any> | undefined

  constructor(private readonly viewService: ViewService, private readonly changeDetectorRef: ChangeDetectorRef) {
    this.viewChangeSubscription = this.viewService.onViewChange.subscribe({
      next: () => this.afterSelectionChange()
    });
  }

  ngAfterViewInit(): void {
    window.setTimeout(() => {
      this.afterSelectionChange();
    }, 1);
  }

  ngOnDestroy(): void {
    this.viewChangeSubscription.unsubscribe();
  }

  private afterSelectionChange() {
    const shapes = this.viewService.getSelectedShapes();
    this.selectedShape = shapes.length === 1 ? shapes[0] : undefined;
    if (this.propertiesComponent !== undefined) {
      this.propertiesComponent.destroy();
      this.propertiesComponent = undefined;
    }
    if (this.propertiesContainer !== undefined && this.selectedShape !== undefined) {
      this.propertiesComponent = this.selectedShape.createPropertiesComponent(this.propertiesContainer, this.viewService.modelService);
      this.changeDetectorRef.markForCheck();
    }
  }
}
