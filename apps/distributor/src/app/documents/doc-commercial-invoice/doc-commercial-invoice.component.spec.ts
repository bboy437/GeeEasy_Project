import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocCommercialInvoiceComponent } from './doc-commercial-invoice.component';

describe('DocCommercialInvoiceComponent', () => {
  let component: DocCommercialInvoiceComponent;
  let fixture: ComponentFixture<DocCommercialInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocCommercialInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocCommercialInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
