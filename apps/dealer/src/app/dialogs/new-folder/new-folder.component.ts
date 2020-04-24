import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'project-new-folder',
  templateUrl: './new-folder.component.html',
  styleUrls: ['./new-folder.component.scss']
})
export class NewFolderComponent implements OnInit {
  arrobjRow: any = {};
  Form: FormGroup;
  submitted = false;

  public message = "No File chosen";

  constructor(
    private formBuilder: FormBuilder,
    protected ref: NbDialogRef<NewFolderComponent>,
  ) { }

  ngOnInit() {
    this.buildForm();

  }

  buildForm() {
    this.Form = this.formBuilder.group({
      massage: ['', Validators.required],
    });
    this.Form.get("massage").patchValue("Untitled folder")
  }

  get f() { return this.Form.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.Form.invalid) {
      return;
    }
  }
  


  btnSaveClick() {

    this.submitted = true;
    if (this.Form.invalid) {
      return;
    }

    this.ref.close(  this.Form.value.message);
  }

 

  btnCancelClick(): void {
    this.ref.close();
  }

  



}
