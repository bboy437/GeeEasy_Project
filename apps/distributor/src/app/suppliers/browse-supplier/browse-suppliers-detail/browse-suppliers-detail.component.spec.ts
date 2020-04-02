import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseSuppliersDetailComponent } from './browse-suppliers-detail.component'

describe('BrowseSuppliersDetailComponent', () => {
  let component: BrowseSuppliersDetailComponent;
  let fixture: ComponentFixture<BrowseSuppliersDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowseSuppliersDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseSuppliersDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
