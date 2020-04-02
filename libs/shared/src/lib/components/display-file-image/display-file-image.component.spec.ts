import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayFileImageComponent } from './display-file-image.component';

describe('DisplayFileImageComponent', () => {
  let component: DisplayFileImageComponent;
  let fixture: ComponentFixture<DisplayFileImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayFileImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayFileImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
