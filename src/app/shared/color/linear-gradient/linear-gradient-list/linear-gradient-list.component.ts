import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'se-linear-gradient-list',
  templateUrl: './linear-gradient-list.component.html',
  styleUrls: ['./linear-gradient-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinearGradientListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
