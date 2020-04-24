import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyDistributorsCreateComponent } from './my-distributors-create.component';

describe('MyDistributorsCreateComponent', () => {
  let component: MyDistributorsCreateComponent;
  let fixture: ComponentFixture<MyDistributorsCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyDistributorsCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyDistributorsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
