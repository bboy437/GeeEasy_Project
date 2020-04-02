import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersSaveComponent } from './orders-save.component';

describe('OrdersSaveComponent', () => {
  let component: OrdersSaveComponent;
  let fixture: ComponentFixture<OrdersSaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersSaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
