import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogsTeamComponent } from './dialogs-team.component';

describe('DialogsTeamComponent', () => {
  let component: DialogsTeamComponent;
  let fixture: ComponentFixture<DialogsTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogsTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogsTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
