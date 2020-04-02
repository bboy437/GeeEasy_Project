import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailerProductCreateComponent } from './retailer-product-create.component';

describe('RetailerProductCreateComponent', () => {
  let component: RetailerProductCreateComponent;
  let fixture: ComponentFixture<RetailerProductCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailerProductCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailerProductCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
