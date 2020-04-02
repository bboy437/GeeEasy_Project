import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailerCreateComponent } from './retailer-create.component';

describe('RetailerCreateComponent', () => {
  let component: RetailerCreateComponent;
  let fixture: ComponentFixture<RetailerCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailerCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailerCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
