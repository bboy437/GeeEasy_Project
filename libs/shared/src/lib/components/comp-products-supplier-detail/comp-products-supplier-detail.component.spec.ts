import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompProductsSupplierDetailComponent } from './comp-products-supplier-detail.component';

describe('CompProductsSupplierDetailComponent', () => {
  let component: CompProductsSupplierDetailComponent;
  let fixture: ComponentFixture<CompProductsSupplierDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompProductsSupplierDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompProductsSupplierDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
