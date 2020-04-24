import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogsReplyRequestComponent } from './dialogs-reply-request.component';

describe('DialogsReplyRequestComponent', () => {
  let component: DialogsReplyRequestComponent;
  let fixture: ComponentFixture<DialogsReplyRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogsReplyRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogsReplyRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
