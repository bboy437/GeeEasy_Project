import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { PurchaseAPIService } from '@project/services';

@Component({
  selector: 'project-dialogs-confirm-po',
  templateUrl: './dialogs-confirm-po.component.html',
  styleUrls: ['./dialogs-confirm-po.component.scss']
})
export class DialogsConfirmPoComponent implements OnInit {
  @Input() data;
  @Input() status: string;
  isSaveLodding = false;

  constructor(
    protected ref: NbDialogRef<DialogsConfirmPoComponent>,
    private purchaseAPIService: PurchaseAPIService
  ) { }

  ngOnInit() {
    console.log(this.data);
    
  }

  btnCancelClick(){
    this.ref.close();
  }

  btnSaveClick() {
    this.isSaveLodding = true;
    this.save()
  }

  save() {
    const dataJson = {
      "purchase_order_id": this.data,
      "confirm_id": 1
    }
    console.log(JSON.stringify(dataJson));
    this.purchaseAPIService.addDilivery(JSON.stringify(dataJson)).subscribe(data => {
      console.log(data);
      this.isSaveLodding = false;
      this.ref.close();
    })

  }

  update(){
    this.purchaseAPIService.updatePO(this.data).subscribe(data => {
      this.ref.close('ok');
    })

  }

}
