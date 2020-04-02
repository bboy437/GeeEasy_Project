import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedListsComponent } from './saved-lists.component';

describe('SavedListsComponent', () => {
  let component: SavedListsComponent;
  let fixture: ComponentFixture<SavedListsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavedListsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
