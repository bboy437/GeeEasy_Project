import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestReplyComponent } from './request-reply.component';

describe('RequestReplyComponent', () => {
  let component: RequestReplyComponent;
  let fixture: ComponentFixture<RequestReplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestReplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestReplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
