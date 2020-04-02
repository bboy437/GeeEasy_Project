import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogsConfirmPoComponent } from './dialogs-confirm-po.component';

describe('DialogsConfirmPoComponent', () => {
  let component: DialogsConfirmPoComponent;
  let fixture: ComponentFixture<DialogsConfirmPoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogsConfirmPoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogsConfirmPoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
