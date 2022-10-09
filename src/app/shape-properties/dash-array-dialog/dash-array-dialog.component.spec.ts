import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashArrayDialogComponent } from './dash-array-dialog.component';

describe('DashArrayDialogComponent', () => {
  let component: DashArrayDialogComponent;
  let fixture: ComponentFixture<DashArrayDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashArrayDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashArrayDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
