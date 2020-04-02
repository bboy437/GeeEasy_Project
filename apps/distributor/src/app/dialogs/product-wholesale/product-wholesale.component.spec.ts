import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductWholesaleComponent } from './product-wholesale.component';

describe('ProductWholesaleComponent', () => {
  let component: ProductWholesaleComponent;
  let fixture: ComponentFixture<ProductWholesaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductWholesaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductWholesaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
