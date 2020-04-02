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
  strCheckin = '0';

  constructor(
    protected ref: NbDialogRef<DialogsCheckinStatusComponent>,
    private formBuilder: FormBuilder,

  ) { }

  ngOnInit() {
    if (this.data > 0) {
      this.strCheckin = '1';
    }

  }


  btnCancelClick() {
    this.ref.close();
  }

  btnSaveClick() {
    this.ref.close(this.strCheckin);
  }

}
