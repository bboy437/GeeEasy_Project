import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogsRequestComponent } from './dialogs-request.component';

describe('DialogsRequestComponent', () => {
  let component: DialogsRequestComponent;
  let fixture: ComponentFixture<DialogsRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogsRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogsRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
