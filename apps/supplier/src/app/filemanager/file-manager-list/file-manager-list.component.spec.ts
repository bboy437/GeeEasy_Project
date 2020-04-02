import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileManagerListComponent } from './file-manager-list.component';

describe('FileManagerListComponent', () => {
  let component: FileManagerListComponent;
  let fixture: ComponentFixture<FileManagerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileManagerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileManagerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
