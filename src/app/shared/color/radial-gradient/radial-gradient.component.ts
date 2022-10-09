import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'se-radial-gradient',
  templateUrl: './radial-gradient.component.html',
  styleUrls: ['./radial-gradient.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadialGradientComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
