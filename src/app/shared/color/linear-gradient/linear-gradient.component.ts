import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'se-linear-gradient',
  templateUrl: './linear-gradient.component.html',
  styleUrls: ['./linear-gradient.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinearGradientComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
