import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifedSupplierDetailComponent } from './verifed-supplier-detail.component';

describe('VerifedSupplierDetailComponent', () => {
  let component: VerifedSupplierDetailComponent;
  let fixture: ComponentFixture<VerifedSupplierDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifedSupplierDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifedSupplierDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
