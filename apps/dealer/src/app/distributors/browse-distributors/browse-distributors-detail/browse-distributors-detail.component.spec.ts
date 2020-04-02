import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseDistributorsDetailComponent } from './browse-distributors-detail.component';

describe('BrowseDistributorsDetailComponent', () => {
  let component: BrowseDistributorsDetailComponent;
  let fixture: ComponentFixture<BrowseDistributorsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowseDistributorsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseDistributorsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
