import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogsSavedListComponent } from './dialogs-saved-list.component';

describe('DialogsSavedListComponent', () => {
  let component: DialogsSavedListComponent;
  let fixture: ComponentFixture<DialogsSavedListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogsSavedListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogsSavedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
