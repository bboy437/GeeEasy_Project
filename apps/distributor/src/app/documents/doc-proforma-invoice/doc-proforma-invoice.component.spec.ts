import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocProformaInvoiceComponent } from './doc-proforma-invoice.component';

describe('DocProformaInvoiceComponent', () => {
  let component: DocProformaInvoiceComponent;
  let fixture: ComponentFixture<DocProformaInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocProformaInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocProformaInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
