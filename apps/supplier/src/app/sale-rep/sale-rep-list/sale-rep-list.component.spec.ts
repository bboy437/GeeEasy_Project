import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleRepListComponent } from './sale-rep-list.component';

describe('SaleRepListComponent', () => {
  let component: SaleRepListComponent;
  let fixture: ComponentFixture<SaleRepListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleRepListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleRepListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
