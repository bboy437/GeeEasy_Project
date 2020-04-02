import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseDetailComponent } from './warehouse-detail.component';

describe('WarehouseDetailComponent', () => {
  let component: WarehouseDetailComponent;
  let fixture: ComponentFixture<WarehouseDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
