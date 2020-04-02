import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerProductDetailComponent } from './seller-product-detail.component';

describe('SellerProductDetailComponent', () => {
  let component: SellerProductDetailComponent;
  let fixture: ComponentFixture<SellerProductDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellerProductDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerProductDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
