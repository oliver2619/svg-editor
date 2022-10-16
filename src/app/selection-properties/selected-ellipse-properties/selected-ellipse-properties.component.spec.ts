import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedEllipsePropertiesComponent } from './selected-ellipse-properties.component';

describe('SelectedEllipsePropertiesComponent', () => {
  let component: SelectedEllipsePropertiesComponent;
  let fixture: ComponentFixture<SelectedEllipsePropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedEllipsePropertiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedEllipsePropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
