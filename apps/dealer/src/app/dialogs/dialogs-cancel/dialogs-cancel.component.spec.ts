import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogsCancelComponent } from './dialogs-cancel.component';

describe('DialogsCancelComponent', () => {
  let component: DialogsCancelComponent;
  let fixture: ComponentFixture<DialogsCancelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogsCancelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogsCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
