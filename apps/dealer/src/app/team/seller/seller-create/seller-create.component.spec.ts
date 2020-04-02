import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerCreateComponent } from './seller-create.component';

describe('SellerCreateComponent', () => {
  let component: SellerCreateComponent;
  let fixture: ComponentFixture<SellerCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellerCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
