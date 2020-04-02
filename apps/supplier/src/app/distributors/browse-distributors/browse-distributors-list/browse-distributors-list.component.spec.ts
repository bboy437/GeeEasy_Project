import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseDistributorsListComponent } from './browse-distributors-list.component';

describe('BrowseDistributorsListComponent', () => {
  let component: BrowseDistributorsListComponent;
  let fixture: ComponentFixture<BrowseDistributorsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowseDistributorsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseDistributorsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
