import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseSuppliersComponent } from './browse-suppliers.component';

describe('BrowseSuppliersComponent', () => {
  let component: BrowseSuppliersComponent;
  let fixture: ComponentFixture<BrowseSuppliersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowseSuppliersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseSuppliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
