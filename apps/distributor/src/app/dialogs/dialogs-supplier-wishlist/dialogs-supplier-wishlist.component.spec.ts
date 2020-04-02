import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogsSupplierWishlistComponent } from './dialogs-supplier-wishlist.component';

describe('DialogsSupplierWishlistComponent', () => {
  let component: DialogsSupplierWishlistComponent;
  let fixture: ComponentFixture<DialogsSupplierWishlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogsSupplierWishlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogsSupplierWishlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
