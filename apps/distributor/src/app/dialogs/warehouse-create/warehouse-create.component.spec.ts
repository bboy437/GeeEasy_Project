import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseCreateComponent } from './warehouse-create.component';

describe('WarehouseCreateComponent', () => {
  let component: WarehouseCreateComponent;
  let fixture: ComponentFixture<WarehouseCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
