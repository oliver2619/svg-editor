import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextMenuEntryComponent } from './context-menu-entry.component';

describe('ContextMenuEntryComponent', () => {
  let component: ContextMenuEntryComponent;
  let fixture: ComponentFixture<ContextMenuEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContextMenuEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContextMenuEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
