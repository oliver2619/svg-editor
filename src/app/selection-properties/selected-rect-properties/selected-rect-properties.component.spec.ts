import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedRectPropertiesComponent } from './selected-rect-properties.component';

describe('SelectedRectPropertiesComponent', () => {
  let component: SelectedRectPropertiesComponent;
  let fixture: ComponentFixture<SelectedRectPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedRectPropertiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedRectPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
