import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'project-dialog-success',
  templateUrl: './dialog-success.component.html',
  styleUrls: ['./dialog-success.component.scss']
})
export class DialogSuccessComponent implements OnInit {
  gifs: string;
  constructor(
    protected ref: NbDialogRef<DialogSuccessComponent>,
  ) { }

  ngOnInit() {

  }


  btnSuccessClick(): void {
    this.ref.close();
  }
}
