import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogsProductGroupComponent } from './dialogs-product-group.component';

describe('DialogsProductGroupComponent', () => {
  let component: DialogsProductGroupComponent;
  let fixture: ComponentFixture<DialogsProductGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogsProductGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogsProductGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
