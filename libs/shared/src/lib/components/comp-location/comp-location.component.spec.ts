import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompLocationComponent } from './comp-location.component';

describe('CompLocationComponent', () => {
  let component: CompLocationComponent;
  let fixture: ComponentFixture<CompLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
