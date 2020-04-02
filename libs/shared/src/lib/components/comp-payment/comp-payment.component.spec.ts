import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompPaymentComponent } from './comp-payment.component';

describe('CompPaymentComponent', () => {
  let component: CompPaymentComponent;
  let fixture: ComponentFixture<CompPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
