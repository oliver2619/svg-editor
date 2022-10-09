import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderInputComponent } from './slider-input.component';

describe('SliderInputComponent', () => {
  let component: SliderInputComponent;
  let fixture: ComponentFixture<SliderInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SliderInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SliderInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
