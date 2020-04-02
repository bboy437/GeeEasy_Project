import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerProductCreateComponent } from './seller-product-create.component';

describe('SellerProductCreateComponent', () => {
  let component: SellerProductCreateComponent;
  let fixture: ComponentFixture<SellerProductCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellerProductCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerProductCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
