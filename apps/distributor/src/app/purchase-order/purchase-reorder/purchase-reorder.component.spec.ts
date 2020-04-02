import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseReorderComponent } from './purchase-reorder.component';

describe('PurchaseReorderComponent', () => {
  let component: PurchaseReorderComponent;
  let fixture: ComponentFixture<PurchaseReorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseReorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseReorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
