import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailerProductDetailComponent } from './retailer-product-detail.component';

describe('RetailerProductDetailComponent', () => {
  let component: RetailerProductDetailComponent;
  let fixture: ComponentFixture<RetailerProductDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailerProductDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailerProductDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
