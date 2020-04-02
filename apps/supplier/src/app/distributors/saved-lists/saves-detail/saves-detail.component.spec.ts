import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavesDetailComponent } from './saves-detail.component';

describe('SavesDetailComponent', () => {
  let component: SavesDetailComponent;
  let fixture: ComponentFixture<SavesDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavesDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
