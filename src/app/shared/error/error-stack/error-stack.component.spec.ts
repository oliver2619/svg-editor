import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorStackComponent } from './error-stack.component';

describe('ErrorComponent', () => {
  let component: ErrorStackComponent;
  let fixture: ComponentFixture<ErrorStackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErrorStackComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorStackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
