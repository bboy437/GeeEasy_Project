import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedDetailComponent } from './saved-detail.component';

describe('SavedDetailComponent', () => {
  let component: SavedDetailComponent;
  let fixture: ComponentFixture<SavedDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavedDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
