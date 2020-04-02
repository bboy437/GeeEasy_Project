import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryInformationListComponent } from './delivery-information-list.component';

describe('DeliveryInformationListComponent', () => {
  let component: DeliveryInformationListComponent;
  let fixture: ComponentFixture<DeliveryInformationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryInformationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryInformationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
