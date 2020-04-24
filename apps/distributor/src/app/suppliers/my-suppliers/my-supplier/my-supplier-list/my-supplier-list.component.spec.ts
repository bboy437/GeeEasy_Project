import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MySupplierListComponent } from './my-supplier-list.component';

describe('MySupplierComponent', () => {
  let component: MySupplierListComponent;
  let fixture: ComponentFixture<MySupplierListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MySupplierListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MySupplierListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
