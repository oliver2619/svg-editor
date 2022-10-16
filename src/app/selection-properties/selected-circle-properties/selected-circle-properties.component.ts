import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, ViewChild } from '@angular/core';
import { FillProperties, ShapeProperties, StrokeProperties } from 'src/app/model/properties/model-element-properties';
import { ShapePropertiesComponent } from 'src/app/shape-properties/shape-properties.component';

@Component({
  selector: 'se-selected-circle-properties',
  templateUrl: './selected-circle-properties.component.html',
  styleUrls: ['./selected-circle-properties.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectedCirclePropertiesComponent implements AfterViewInit {

  readonly onFillChange = new EventEmitter<FillProperties>();
  readonly onStrokeChange = new EventEmitter<StrokeProperties>();
  readonly onShapeChange = new EventEmitter<ShapeProperties>();

  fillProperties: FillProperties | undefined;
  shapeProperties: ShapeProperties | undefined;
  strokeProperties: StrokeProperties | undefined;

  @ViewChild(ShapePropertiesComponent)
  shapePropertiesComponent: ShapePropertiesComponent | undefined;

  constructor() { }

  ngAfterViewInit(): void {
    if (this.fillProperties !== undefined) {
      this.shapePropertiesComponent!.fillProperties = this.fillProperties;
    }
    if (this.shapeProperties !== undefined) {
      this.shapePropertiesComponent!.shapeProperties = this.shapeProperties;
    }
    if (this.strokeProperties !== undefined) {
      this.shapePropertiesComponent!.strokeProperties = this.strokeProperties;
    }
    this.shapePropertiesComponent!.onFillChange.subscribe({ next: (p: FillProperties) => this.onFillChange.emit(p) });
    this.shapePropertiesComponent!.onStrokeChange.subscribe({ next: (p: StrokeProperties) => this.onStrokeChange.emit(p) });
    this.shapePropertiesComponent!.onShapeChange.subscribe({ next: (p: ShapeProperties) => this.onShapeChange.emit(p) });
  }
}
