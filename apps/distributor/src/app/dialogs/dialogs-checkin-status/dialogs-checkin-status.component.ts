import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CheckinAPIService } from '@project/services';

@Component({
  selector: 'project-dialogs-checkin-status',
  templateUrl: './dialogs-checkin-status.component.html',
  styleUrls: ['./dialogs-checkin-status.component.scss']
})
export class DialogsCheckinStatusComponent implements OnInit {

  @Input() data: number;
  @Input() status: number;
  Form: FormGroup;

  constructor(
    protected ref: NbDialogRef<DialogsCheckinStatusComponent>,
    private formBuilder: FormBuilder,

  ) { }

  ngOnInit() {
    console.log(this.data);
    this.buildForm();
  }

  buildForm() {
    this.Form = this.formBuilder.group({
      strCheckin: ['', Validators.required],
    });

    if (this.data === 0) {
      this.Form.get("strCheckin").patchValue("0");
    } else {
      this.Form.get("strCheckin").patchValue("1");
    }

  }

  btnCancelClick() {
    this.ref.close();
  }

  btnSaveClick() {
    this.ref.close(this.Form.value.strCheckin);
  }

}
