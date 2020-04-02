import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogsMapComponent } from './dialogs-map.component';

describe('DialogsMapComponent', () => {
  let component: DialogsMapComponent;
  let fixture: ComponentFixture<DialogsMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogsMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogsMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
