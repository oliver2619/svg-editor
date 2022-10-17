import { ChangeDetectionStrategy, Component, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageProperties } from 'src/app/model/properties/model-element-properties';
import { ImagePreviewComponentEvent } from 'src/app/shared/image-preview/image-preview.component';

interface SelectedImagePropertiesComponentValue {
  opacity: number;
  preserveAspectRatio: boolean;
}

@Component({
  selector: 'se-selected-image-properties',
  templateUrl: './selected-image-properties.component.html',
  styleUrls: ['./selected-image-properties.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectedImagePropertiesComponent {

  readonly formGroup: FormGroup;

  readonly onImageChange = new EventEmitter<ImageProperties>();

  private _properties: ImageProperties | undefined;

  get imageUrl(): string { return this._properties?.url ?? ''; }

  set properties(p: ImageProperties) {
    this._properties = { ...p };
    const v = { ...this.value };
    v.opacity = p.opacity * 100;
    v.preserveAspectRatio = p.preserveAspectRatio;
    this.value = v;
  }

  private get value(): SelectedImagePropertiesComponentValue { return this.formGroup.value; }

  private set value(v: SelectedImagePropertiesComponentValue) { this.formGroup.setValue(v); }

  constructor(formBuilder: FormBuilder) {
    this.formGroup = formBuilder.group({});
    this.formGroup.addControl('opacity', formBuilder.control(100, [Validators.required]));
    this.formGroup.addControl('preserveAspectRatio', formBuilder.control(true, []));
  }

  onUploadImage(ev: ImagePreviewComponentEvent) {
    this._properties!.url = ev.url;
    this.onImageChange.emit({ ...this._properties! });
  }

  onChangeOpacity(opacity: number) {
    this._properties!.opacity = opacity / 100;
    this.onImageChange.emit({ ...this._properties! });
  }

  onChangePreserveAspectRatio() {
    this._properties!.preserveAspectRatio = this.value.preserveAspectRatio;
    this.onImageChange.emit({ ...this._properties! });
  }
}
