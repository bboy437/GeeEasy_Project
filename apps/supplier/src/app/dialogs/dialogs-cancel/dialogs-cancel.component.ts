import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'project-dialogs-cancel',
  templateUrl: './dialogs-cancel.component.html',
  styleUrls: ['./dialogs-cancel.component.scss']
})
export class DialogsCancelComponent implements OnInit {

  constructor(
    protected ref: NbDialogRef<DialogsCancelComponent>,
  ) { }

  ngOnInit() {
  }

  btnCancelClick() {
    this.ref.close('cancel');
  }

  btnOkClick() {
    this.ref.close('ok');
  }

}
