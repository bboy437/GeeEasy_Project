import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProductDetailComponent } from './my-product-detail.component';

describe('MyProductDetailComponent', () => {
  let component: MyProductDetailComponent;
  let fixture: ComponentFixture<MyProductDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyProductDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyProductDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
