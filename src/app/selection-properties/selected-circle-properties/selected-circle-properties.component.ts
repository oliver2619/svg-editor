import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, ViewChild } from '@angular/core';
import { CircleProperties, FillProperties, ShapeProperties, StrokeProperties } from 'src/app/model/properties/model-element-properties';
import { ShapePropertiesComponent } from 'src/app/shape-properties/shape-properties.component';

@Component({
  selector: 'se-selected-circle-properties',
  templateUrl: './selected-circle-properties.component.html',
  styleUrls: ['./selected-circle-properties.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectedCirclePropertiesComponent implements AfterViewInit {

  @ViewChild(ShapePropertiesComponent)
  shapePropertiesComponent: ShapePropertiesComponent | undefined;

  readonly onCircleChange = new EventEmitter<CircleProperties>();

  properties: CircleProperties | undefined;

  ngAfterViewInit(): void {
    this.shapePropertiesComponent!.fillProperties = { ...this.properties!.fill };
    this.shapePropertiesComponent!.shapeProperties = { ...this.properties! };
    this.shapePropertiesComponent!.strokeProperties = { ...this.properties!.stroke };
    this.shapePropertiesComponent!.onFillChange.subscribe({
      next: (p: FillProperties) => {
        this.properties!.fill = p;
        this.onCircleChange.emit({ ...this.properties! });
      }
    });
    this.shapePropertiesComponent!.onStrokeChange.subscribe({
      next: (p: StrokeProperties) => {
        this.properties!.stroke = p;
        this.onCircleChange.emit({ ...this.properties! });
      }
    });
    this.shapePropertiesComponent!.onShapeChange.subscribe({
      next: (p: ShapeProperties) => {
        this.properties = { ...this.properties!, ...p }
        this.onCircleChange.emit({ ...this.properties! });
      }
    });
  }
}
