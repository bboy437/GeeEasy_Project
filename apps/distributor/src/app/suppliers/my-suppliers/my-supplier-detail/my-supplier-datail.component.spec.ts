import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MysupplierDetailComponent } from './my-supplier-detail.component';

describe('MysupplierInformationComponent', () => {
  let component: MysupplierDetailComponent;
  let fixture: ComponentFixture<MysupplierDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MysupplierDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MysupplierDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
