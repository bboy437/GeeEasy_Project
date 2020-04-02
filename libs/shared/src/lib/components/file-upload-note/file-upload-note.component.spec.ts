import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadNoteComponent } from './file-upload-note.component';

describe('FileUploadNoteComponent', () => {
  let component: FileUploadNoteComponent;
  let fixture: ComponentFixture<FileUploadNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileUploadNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
