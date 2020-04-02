import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'project-dialogs-image',
  templateUrl: './dialogs-image.component.html',
  styleUrls: ['./dialogs-image.component.scss']
})
export class DialogsImageComponent implements OnInit {

  @Input() imgURL: string;
  // imgURL:any;

  constructor(
    protected ref: NbDialogRef<DialogsImageComponent>,
  ) { }

  ngOnInit() {
  }
  
  btnCancelClick(): void {
    this.ref.close();
  }

}
