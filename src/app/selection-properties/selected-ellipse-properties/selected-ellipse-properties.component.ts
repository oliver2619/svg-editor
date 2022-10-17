import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, ViewChild } from '@angular/core';
import { EllipseProperties, FillProperties, ShapeProperties, StrokeProperties } from 'src/app/model/properties/model-element-properties';
import { ShapePropertiesComponent } from 'src/app/shape-properties/shape-properties.component';

@Component({
  selector: 'se-selected-ellipse-properties',
  templateUrl: './selected-ellipse-properties.component.html',
  styleUrls: ['./selected-ellipse-properties.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectedEllipsePropertiesComponent implements AfterViewInit {

  @ViewChild(ShapePropertiesComponent)
  shapePropertiesComponent: ShapePropertiesComponent | undefined;

  readonly onEllipseChange = new EventEmitter<EllipseProperties>();

  properties: EllipseProperties | undefined;

  ngAfterViewInit(): void {
    this.shapePropertiesComponent!.fillProperties = { ...this.properties!.fill };
    this.shapePropertiesComponent!.shapeProperties = { ...this.properties! };
    this.shapePropertiesComponent!.strokeProperties = { ...this.properties!.stroke };
    this.shapePropertiesComponent!.onFillChange.subscribe({
      next: (p: FillProperties) => {
        this.properties!.fill = p;
        this.onEllipseChange.emit({ ...this.properties! });
      }
    });
    this.shapePropertiesComponent!.onStrokeChange.subscribe({
      next: (p: StrokeProperties) => {
        this.properties!.stroke = p;
        this.onEllipseChange.emit({ ...this.properties! });
      }
    });
    this.shapePropertiesComponent!.onShapeChange.subscribe({
      next: (p: ShapeProperties) => {
        this.properties = { ...this.properties!, ...p }
        this.onEllipseChange.emit({ ...this.properties! });
      }
    });
  }
}
