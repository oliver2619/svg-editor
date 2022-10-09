import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'se-palette',
  templateUrl: './palette.component.html',
  styleUrls: ['./palette.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaletteComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
