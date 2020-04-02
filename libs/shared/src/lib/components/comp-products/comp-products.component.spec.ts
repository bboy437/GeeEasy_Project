import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompProductsComponent } from './comp-products.component';

describe('CompProductsComponent', () => {
  let component: CompProductsComponent;
  let fixture: ComponentFixture<CompProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
