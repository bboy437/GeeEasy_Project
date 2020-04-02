import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleRepCreateComponent } from './sale-rep-create.component';

describe('SaleRepCreateComponent', () => {
  let component: SaleRepCreateComponent;
  let fixture: ComponentFixture<SaleRepCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleRepCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleRepCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
