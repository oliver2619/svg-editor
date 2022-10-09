import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorPatternDialogComponent } from './color-pattern-dialog.component';

describe('ColorPatternDialogComponent', () => {
  let component: ColorPatternDialogComponent;
  let fixture: ComponentFixture<ColorPatternDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColorPatternDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColorPatternDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
