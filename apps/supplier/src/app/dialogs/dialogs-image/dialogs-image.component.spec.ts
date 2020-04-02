import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogsImageComponent } from './dialogs-image.component';

describe('DialogsImageComponent', () => {
  let component: DialogsImageComponent;
  let fixture: ComponentFixture<DialogsImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogsImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogsImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
