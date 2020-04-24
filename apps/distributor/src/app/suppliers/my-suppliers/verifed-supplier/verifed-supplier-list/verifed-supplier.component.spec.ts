import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifedSupplierComponent } from './verifed-supplier.component';

describe('VerifedSupplierComponent', () => {
  let component: VerifedSupplierComponent;
  let fixture: ComponentFixture<VerifedSupplierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifedSupplierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifedSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
