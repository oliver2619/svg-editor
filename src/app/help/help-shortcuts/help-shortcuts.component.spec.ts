import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpShortcutsComponent } from './help-shortcuts.component';

describe('HelpShortcutsComponent', () => {
  let component: HelpShortcutsComponent;
  let fixture: ComponentFixture<HelpShortcutsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpShortcutsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpShortcutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
