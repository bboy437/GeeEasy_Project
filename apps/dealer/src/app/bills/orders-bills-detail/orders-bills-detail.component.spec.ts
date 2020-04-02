import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersBillsDetailComponent } from './orders-bills-detail.component';

describe('OrdersBillsDetailComponent', () => {
  let component: OrdersBillsDetailComponent;
  let fixture: ComponentFixture<OrdersBillsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersBillsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersBillsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
