import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompCategoryComponent } from './comp-category.component';

describe('CompCategoryComponent', () => {
  let component: CompCategoryComponent;
  let fixture: ComponentFixture<CompCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
