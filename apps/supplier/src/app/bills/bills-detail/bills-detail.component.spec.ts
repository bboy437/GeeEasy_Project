import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillsDetailComponent } from './bills-detail.component';

describe('BillsDetailComponent', () => {
  let component: BillsDetailComponent;
  let fixture: ComponentFixture<BillsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
