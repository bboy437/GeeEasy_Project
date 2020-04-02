import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckInDetailComponent } from './check-in-detail.component';

describe('CheckInDetailComponent', () => {
  let component: CheckInDetailComponent;
  let fixture: ComponentFixture<CheckInDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckInDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckInDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
