import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'project-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnInit {
  @Input() icon: string;
  @Input() title: string;

  constructor(
    protected ref: NbDialogRef<DeleteComponent>,
  ) { }

  ngOnInit() {
  }

  btnCancelClick() {
    this.ref.close('cancel');
  }

  btnDeleteClick() {
    this.ref.close('ok');
  }


}
