import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteDetailComponent } from './favorite-detail.component';

describe('FavoriteDetailComponent', () => {
  let component: FavoriteDetailComponent;
  let fixture: ComponentFixture<FavoriteDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavoriteDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
