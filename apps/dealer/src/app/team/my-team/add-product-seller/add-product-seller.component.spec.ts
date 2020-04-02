import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductSellerComponent } from './add-product-seller.component';

describe('AddProductSellerComponent', () => {
  let component: AddProductSellerComponent;
  let fixture: ComponentFixture<AddProductSellerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProductSellerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
