import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFileUploadComponent } from './list-file-upload.component';

describe('ListFileUploadComponent', () => {
  let component: ListFileUploadComponent;
  let fixture: ComponentFixture<ListFileUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListFileUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
