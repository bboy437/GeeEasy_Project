import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarvoriteComponent } from './farvorite.component';

describe('FarvoriteComponent', () => {
  let component: FarvoriteComponent;
  let fixture: ComponentFixture<FarvoriteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FarvoriteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarvoriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
