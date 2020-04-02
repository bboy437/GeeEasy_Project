import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersCreateComponent } from './orders-create.component';

describe('OrdersCreateComponent', () => {
  let component: OrdersCreateComponent;
  let fixture: ComponentFixture<OrdersCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
