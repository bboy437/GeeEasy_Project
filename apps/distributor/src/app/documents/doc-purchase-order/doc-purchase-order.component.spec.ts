import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocPurchaseOrderComponent } from './doc-purchase-order.component';

describe('DocPurchaseOrderComponent', () => {
  let component: DocPurchaseOrderComponent;
  let fixture: ComponentFixture<DocPurchaseOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocPurchaseOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocPurchaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
