import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'project-warehouse-create-dialog',
  templateUrl: './warehouse-create.component.html',
  styleUrls: ['./warehouse-create.component.scss']
})
export class WarehouseCreateComponent implements OnInit {

  id_local: string;

  constructor(
    protected ref: NbDialogRef<WarehouseCreateComponent>,

  ) {
    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local)
  }

  ngOnInit() {
  }

  btnCancelClick(data): void {
    this.ref.close('ok');
  }

}
