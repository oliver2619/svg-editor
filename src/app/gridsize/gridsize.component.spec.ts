import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridsizeComponent } from './gridsize.component';

describe('GridsizeComponent', () => {
  let component: GridsizeComponent;
  let fixture: ComponentFixture<GridsizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridsizeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridsizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
