import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinearGradientComponent } from './linear-gradient.component';

describe('LinearGradientComponent', () => {
  let component: LinearGradientComponent;
  let fixture: ComponentFixture<LinearGradientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinearGradientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinearGradientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
