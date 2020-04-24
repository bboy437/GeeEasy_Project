import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryLogListComponent } from './inventory-log-list.component';

describe('InventoryLogListComponent', () => {
  let component: InventoryLogListComponent;
  let fixture: ComponentFixture<InventoryLogListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryLogListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryLogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
