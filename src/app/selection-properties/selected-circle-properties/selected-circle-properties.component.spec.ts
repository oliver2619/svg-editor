import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedCirclePropertiesComponent } from './selected-circle-properties.component';

describe('SelectedCirclePropertiesComponent', () => {
  let component: SelectedCirclePropertiesComponent;
  let fixture: ComponentFixture<SelectedCirclePropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedCirclePropertiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedCirclePropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
