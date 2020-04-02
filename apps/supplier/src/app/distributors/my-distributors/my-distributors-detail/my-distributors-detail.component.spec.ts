import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyDistributorsDetailComponent } from './my-distributors-detail.component';

describe('MyDistributorsDetailComponent', () => {
  let component: MyDistributorsDetailComponent;
  let fixture: ComponentFixture<MyDistributorsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyDistributorsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyDistributorsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
