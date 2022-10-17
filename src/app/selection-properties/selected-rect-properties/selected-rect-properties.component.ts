import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LineJoin } from 'src/app/model/line-properties';
import { FillProperties, RectProperties, ShapeProperties, StrokeProperties } from 'src/app/model/properties/model-element-properties';
import { ShapePropertiesComponent } from 'src/app/shape-properties/shape-properties.component';

interface SelectedRectPropertiesComponentValue {
  rx: number;
  ry: number;
}

@Component({
  selector: 'se-selected-rect-properties',
  templateUrl: './selected-rect-properties.component.html',
  styleUrls: ['./selected-rect-properties.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectedRectPropertiesComponent implements AfterViewInit {

  @ViewChild(ShapePropertiesComponent)
  shapePropertiesComponent: ShapePropertiesComponent | undefined;

  readonly formGroup: FormGroup;

  readonly onRectChange = new EventEmitter<RectProperties>();

  _properties: RectProperties | undefined;

  set properties(p: RectProperties) {
    this._properties = {...p};
    const v = { ...this.value };
    v.rx = p.rx;
    v.ry = p.ry;
    this.value = v;
  }

  private get value(): SelectedRectPropertiesComponentValue { return this.formGroup.value; }

  private set value(v: SelectedRectPropertiesComponentValue) { this.formGroup.setValue(v); }

  constructor(formBuilder: FormBuilder) {
    this.formGroup = formBuilder.group({});
    this.formGroup.addControl('rx', formBuilder.control(0, [Validators.required, Validators.min(0)]));
    this.formGroup.addControl('ry', formBuilder.control(0, [Validators.required, Validators.min(0)]));
  }

  ngAfterViewInit(): void {
    this.shapePropertiesComponent!.fillProperties = { ...this._properties!.fill };
    this.shapePropertiesComponent!.strokeProperties = { ...this._properties!.stroke };
    this.shapePropertiesComponent!.shapeProperties = { ...this._properties! };
    this.shapePropertiesComponent!.lineJoin = this._properties!.lineJoin;
    this.shapePropertiesComponent!.onFillChange.subscribe({
      next: (p: FillProperties) => {
        this._properties!.fill = p;
        this.onRectChange.emit({ ...this._properties! });
      }
    });
    this.shapePropertiesComponent!.onStrokeChange.subscribe({
      next: (p: StrokeProperties) => {
        this._properties!.stroke = p;
        this.onRectChange.emit({ ...this._properties! });
      }
    });
    this.shapePropertiesComponent!.onShapeChange.subscribe({
      next: (p: ShapeProperties) => {
        this._properties = { ...this._properties!, ...p };
        this.onRectChange.emit({ ...this._properties! });
      }
    });
    this.shapePropertiesComponent!.onLineJoinChange.subscribe({
      next: (j: LineJoin) => {
        this._properties!.lineJoin = j;
        this.onRectChange.emit({ ...this._properties! });
      }
    });
  }

  onChangeRx() {
    this._properties!.rx = this.value.rx;
    this.onRectChange.emit({ ...this._properties! });
  }

  onChangeRy() {
    this._properties!.ry = this.value.ry;
    this.onRectChange.emit({ ...this._properties! });
  }
}
