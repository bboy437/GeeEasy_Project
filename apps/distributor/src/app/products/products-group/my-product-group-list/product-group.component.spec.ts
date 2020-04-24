import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProductGroupComponent } from './product-group.component';

describe('MyProductGroupComponent', () => {
  let component: MyProductGroupComponent;
  let fixture: ComponentFixture<MyProductGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyProductGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyProductGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
