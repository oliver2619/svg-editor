import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinearGradientListComponent } from './linear-gradient-list.component';

describe('LinearGradientListComponent', () => {
  let component: LinearGradientListComponent;
  let fixture: ComponentFixture<LinearGradientListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinearGradientListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinearGradientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
