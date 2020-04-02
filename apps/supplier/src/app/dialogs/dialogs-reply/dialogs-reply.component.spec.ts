import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogsReplyComponent } from './dialogs-reply.component';

describe('DialogsReplyComponent', () => {
  let component: DialogsReplyComponent;
  let fixture: ComponentFixture<DialogsReplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogsReplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogsReplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
