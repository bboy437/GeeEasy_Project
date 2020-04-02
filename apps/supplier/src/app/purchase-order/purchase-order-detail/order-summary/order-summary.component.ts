import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
import { NbDialogService } from '@nebular/theme';
import { AleartComponent } from '../../../dialogs/aleart/aleart.component';
import { PurchaseAPIService } from '@project/services';
import { DialogsConfirmPoComponent } from '../../../dialogs/dialogs-confirm-po/dialogs-confirm-po.component';

@Component({
  selector: "project-order-summary",
  templateUrl: "./order-summary.component.html",
  styleUrls: ["./order-summary.component.scss"]
})
export class OrderSummaryComponent implements OnInit {
  @Input() data: any = [];
  @Input() purchaseID: string;
  @Input() openConfirm: boolean;
  @Output() reloadUpdate = new EventEmitter<any>();
  
  openUpdate = true;

  private UrlRouter_CheckIn = "checkins/checkin";
  constructor(private router: Router,
    private dialogService: NbDialogService,
    private purchaseAPIService: PurchaseAPIService) { }

  ngOnInit() {
    console.log('openConfirm', this.openConfirm);
    console.log('purchaseID', this.purchaseID);
  }

  btnCheckIn() {
    this.router.navigate([this.UrlRouter_CheckIn, { id: 1 }]);
  }

  cuculate(event, data) {
    console.log(event, data);

    if (data.total_discount >= data.total_price || data.total_discount === "") {
      const dialogRef = this.dialogService.open(AleartComponent, {
        context: {
          status: 'summary',
        },
      });
      dialogRef.onClose.subscribe(result => {
        if (result === 'ok') {
          this.openUpdate = true;
          data.total_discount = 0;
          const totol_price = (data.total_price - data.total_discount);
          const product_price_none_vat = (totol_price * 100) / 107;
          const vat_total = (totol_price - product_price_none_vat);
          const total_grand = product_price_none_vat + vat_total;

          data.total_vat_none = product_price_none_vat;
          data.total_vat = vat_total;
          data.total_grand = total_grand;
          data.total_sub = totol_price;
        }
      });

    } else {
      this.openUpdate = false;
      const totol_price = (data.total_price - data.total_discount);

      //100 / ค่าแท็ก ex. 107
      const product_price_none_vat = (totol_price * 100) / 107;
      const vat_total = (totol_price - product_price_none_vat);
      const total_grand = product_price_none_vat + vat_total;

      data.total_vat_none = product_price_none_vat;
      data.total_vat = vat_total;
      data.total_grand = total_grand;
      data.total_sub = totol_price;
    }

  }

  update() {
    if (this.data.total_grand > 0) {
      const dataJson = {
        purchase_order_id: this.purchaseID,
        purchase_order_summary: {
          total_discount: Number(this.data.total_discount),
          total_grand: this.data.total_grand,
          total_price: this.data.total_price,
          total_sub: this.data.total_sub,
          total_vat: this.data.total_vat,
          total_vat_none: this.data.total_vat_none,
        }

      }
      const dataJsons = JSON.stringify(dataJson);
      console.log(dataJson);

      const dialogRef = this.dialogService.open(DialogsConfirmPoComponent, {
        context: {
          data: dataJsons,
          status: "summary"
        }
      });
      dialogRef.onClose.subscribe(result => {
        if(result === 'ok'){
          this.openUpdate = true;
          this.reloadUpdate.emit(true)
        }

      });


    }




  }



}
