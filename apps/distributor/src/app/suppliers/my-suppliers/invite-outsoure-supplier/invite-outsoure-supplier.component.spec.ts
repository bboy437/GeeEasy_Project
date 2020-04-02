import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteOutsoureSupplierComponent } from './invite-outsoure-supplier.component';

describe('InviteOutsoureSupplierComponent', () => {
  let component: InviteOutsoureSupplierComponent;
  let fixture: ComponentFixture<InviteOutsoureSupplierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteOutsoureSupplierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteOutsoureSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
