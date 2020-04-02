import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealersListComponent } from './dealers-list.component';

describe('DealersListComponent', () => {
  let component: DealersListComponent;
  let fixture: ComponentFixture<DealersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
