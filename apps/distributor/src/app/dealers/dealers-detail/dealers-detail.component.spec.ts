import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealersDetailComponent } from './dealers-detail.component';

describe('DealersDetailComponent', () => {
  let component: DealersDetailComponent;
  let fixture: ComponentFixture<DealersDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealersDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealersDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
