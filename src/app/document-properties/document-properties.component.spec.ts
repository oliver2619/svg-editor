import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentPropertiesComponent } from './document-properties.component';

describe('DocumentPropertiesComponent', () => {
  let component: DocumentPropertiesComponent;
  let fixture: ComponentFixture<DocumentPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentPropertiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
