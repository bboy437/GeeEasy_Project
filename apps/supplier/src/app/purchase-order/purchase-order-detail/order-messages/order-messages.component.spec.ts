import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMessagesComponent } from './order-messages.component';

describe('OrderMessagesComponent', () => {
  let component: OrderMessagesComponent;
  let fixture: ComponentFixture<OrderMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
