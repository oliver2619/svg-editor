import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportSvgComponent } from './import-svg.component';

describe('ImportSvgComponent', () => {
  let component: ImportSvgComponent;
  let fixture: ComponentFixture<ImportSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportSvgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
