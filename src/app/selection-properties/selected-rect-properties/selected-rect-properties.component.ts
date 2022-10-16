import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'se-selected-rect-properties',
  templateUrl: './selected-rect-properties.component.html',
  styleUrls: ['./selected-rect-properties.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectedRectPropertiesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
