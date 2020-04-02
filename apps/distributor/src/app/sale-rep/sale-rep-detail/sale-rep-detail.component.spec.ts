import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleRepDetailComponent } from './sale-rep-detail.component';

describe('SaleRepListComponent', () => {
  let component: SaleRepDetailComponent;
  let fixture: ComponentFixture<SaleRepDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleRepDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleRepDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
