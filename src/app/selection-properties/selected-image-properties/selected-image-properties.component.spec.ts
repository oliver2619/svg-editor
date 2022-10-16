import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedImagePropertiesComponent } from './selected-image-properties.component';

describe('SelectedImagePropertiesComponent', () => {
  let component: SelectedImagePropertiesComponent;
  let fixture: ComponentFixture<SelectedImagePropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedImagePropertiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedImagePropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
