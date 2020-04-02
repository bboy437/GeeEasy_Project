import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoProductsComponent } from './po-products.component';

describe('PoProductsComponent', () => {
  let component: PoProductsComponent;
  let fixture: ComponentFixture<PoProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
