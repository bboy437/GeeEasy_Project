import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyDistributorsListComponent } from './my-distributors-list.component';

describe('MyDistributorsListComponent', () => {
  let component: MyDistributorsListComponent;
  let fixture: ComponentFixture<MyDistributorsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyDistributorsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyDistributorsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
