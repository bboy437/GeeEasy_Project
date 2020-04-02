import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogsSupplierRequestComponent } from './dialogs-supplier-request.component';

describe('DialogsSupplierRequestComponent', () => {
  let component: DialogsSupplierRequestComponent;
  let fixture: ComponentFixture<DialogsSupplierRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogsSupplierRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogsSupplierRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
