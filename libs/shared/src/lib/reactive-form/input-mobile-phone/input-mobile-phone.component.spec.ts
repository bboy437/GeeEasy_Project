import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputMobilePhoneComponent } from './input-mobile-phone.component';

describe('InputMobilePhoneComponent', () => {
  let component: InputMobilePhoneComponent;
  let fixture: ComponentFixture<InputMobilePhoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputMobilePhoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputMobilePhoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
