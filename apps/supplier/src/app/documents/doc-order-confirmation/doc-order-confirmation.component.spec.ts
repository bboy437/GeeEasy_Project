import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocOrderConfirmationComponent } from './doc-order-confirmation.component';

describe('DocOrderConfirmationComponent', () => {
  let component: DocOrderConfirmationComponent;
  let fixture: ComponentFixture<DocOrderConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocOrderConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocOrderConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
