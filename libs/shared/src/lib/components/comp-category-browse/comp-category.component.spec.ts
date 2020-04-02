import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompCategoryBrowseComponent } from './comp-category.component';

describe('CompCategoryBrowseComponent', () => {
  let component: CompCategoryBrowseComponent;
  let fixture: ComponentFixture<CompCategoryBrowseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompCategoryBrowseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompCategoryBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
