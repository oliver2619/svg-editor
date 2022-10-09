import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'se-pattern',
  templateUrl: './pattern.component.html',
  styleUrls: ['./pattern.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatternComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
