import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompCategoryOwnComponent } from './comp-category-own.component';

describe('CompCategoryOwnComponent', () => {
  let component: CompCategoryOwnComponent;
  let fixture: ComponentFixture<CompCategoryOwnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompCategoryOwnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompCategoryOwnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
