import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogsTeamCreateComponent } from './dialogs-team-create.component';

describe('DialogsTeamCreateComponent', () => {
  let component: DialogsTeamCreateComponent;
  let fixture: ComponentFixture<DialogsTeamCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogsTeamCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogsTeamCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
