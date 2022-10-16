import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'se-selected-image-properties',
  templateUrl: './selected-image-properties.component.html',
  styleUrls: ['./selected-image-properties.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectedImagePropertiesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
