import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogsWishlistComponent } from './dialogs-wishlist.component';

describe('DialogsWishlistComponent', () => {
  let component: DialogsWishlistComponent;
  let fixture: ComponentFixture<DialogsWishlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogsWishlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogsWishlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
