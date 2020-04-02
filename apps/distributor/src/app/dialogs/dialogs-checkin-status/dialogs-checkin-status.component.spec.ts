import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogsCheckinStatusComponent } from './dialogs-checkin-status.component';

describe('DialogsCheckinStatusComponent', () => {
  let component: DialogsCheckinStatusComponent;
  let fixture: ComponentFixture<DialogsCheckinStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogsCheckinStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogsCheckinStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
