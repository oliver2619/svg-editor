import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'se-selected-ellipse-properties',
  templateUrl: './selected-ellipse-properties.component.html',
  styleUrls: ['./selected-ellipse-properties.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectedEllipsePropertiesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
