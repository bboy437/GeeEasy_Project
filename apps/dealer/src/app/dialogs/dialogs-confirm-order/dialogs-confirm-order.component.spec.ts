import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogsConfirmOrderComponent } from './dialogs-confirm-order.component';

describe('DialogsConfirmOrderComponent', () => {
  let component: DialogsConfirmOrderComponent;
  let fixture: ComponentFixture<DialogsConfirmOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogsConfirmOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogsConfirmOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
