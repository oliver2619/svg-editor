import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadialGradientComponent } from './radial-gradient.component';

describe('RadialGradientComponent', () => {
  let component: RadialGradientComponent;
  let fixture: ComponentFixture<RadialGradientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RadialGradientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadialGradientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
