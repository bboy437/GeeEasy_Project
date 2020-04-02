import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderSaveComponent } from './purchase-order-save.component';

describe('PurchaseOrderSaveComponent', () => {
  let component: PurchaseOrderSaveComponent;
  let fixture: ComponentFixture<PurchaseOrderSaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseOrderSaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
