import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'se-selection-properties',
  templateUrl: './selection-properties.component.html',
  styleUrls: ['./selection-properties.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectionPropertiesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
