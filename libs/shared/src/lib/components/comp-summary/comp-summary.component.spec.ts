import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompSummaryComponent } from './comp-summary.component';

describe('CompSummaryComponent', () => {
  let component: CompSummaryComponent;
  let fixture: ComponentFixture<CompSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
