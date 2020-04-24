import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogsReplyPOComponent } from './dialogs-reply-po.component';

describe('DialogsReplyPOComponent', () => {
  let component: DialogsReplyPOComponent;
  let fixture: ComponentFixture<DialogsReplyPOComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogsReplyPOComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogsReplyPOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
