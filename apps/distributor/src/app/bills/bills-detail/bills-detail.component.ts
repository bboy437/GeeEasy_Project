import { Component, OnInit } from '@angular/core';
import { BillingAPIService, PurchaseAPIService } from '@project/services';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogsImageComponent } from '../../dialogs/dialogs-image/dialogs-image.component';
import { NbDialogService } from '@nebular/theme';
import { ConfirmPaymentComponent } from '../../dialogs/confirm-payment/confirm-payment.component';
import { DatePipe } from '@angular/common'

@Component({
  selector: 'project-bills-detail',
  templateUrl: './bills-detail.component.html',
  styleUrls: ['./bills-detail.component.scss']
})
export class BillsDetailComponent implements OnInit {

  private UrlRouter_PurchaseList = "bills/list";
  arrBills: any = [];
  arrBillsProduct: any = [];
  arrBillsSummary: any = [];
  purchase_order_paid_row: any = [];
  arrDoc: any = [];
  sum: number;
  RowID: string;
  delivery_date: number;
  loading = false;

  dueDate: number;
  dueDateStatus: number;
  payment_total: number;
  over = 0;


  constructor(
    private billingAPIService: BillingAPIService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: NbDialogService,
    private purchaseAPIService: PurchaseAPIService,
    public datepipe: DatePipe
  ) {
    this.loading = true;
  }

  ngOnInit() {
    const params = this.route.snapshot.paramMap;
    this.RowID = params.get("id");
    if (this.RowID) {
      this.getBillsDetail();
    }
  }

  getBillsDetail() {

    this.purchaseAPIService.getPurchaseDetail(this.RowID).subscribe(data => {
      this.arrBills = data.response_data[0];

      console.log(this.arrBills);

      // this.delivery_date = new Date(this.arrBills.delivery_date * 1000)
      // this.delivery_date = this.datepipe.transform(date, 'dd/MM/yyyy');

      if (this.arrBills.purchase_order_reply_id === 0) {
        this.arrBills.status = "Waiting"
      }
      if (this.arrBills.purchase_order_reply_id === 1) {
        this.arrBills.status = "Confirmed"
      }
      if (this.arrBills.purchase_order_reply_id === 2) {
        this.arrBills.status = "In Negotiation"
      }
      if (this.arrBills.purchase_order_reply_id === 3) {
        this.arrBills.status = "Canceled"
      }

      this.arrBillsProduct = data.response_data[0].purchase_order_product_array;
      this.arrBillsSummary = data.response_data[0].purchase_order_summary;
      this.arrBillsSummary.product_currency_code = this.arrBillsProduct[0].product_data.product_data.product_currency_code;
      if (this.arrBills.purchase_order_paid_row.length > 0) {
        this.purchase_order_paid_row = data.response_data[0].purchase_order_paid_row;
        this.purchase_order_paid_row.forEach(element => {
          element.product_currency_code = this.arrBillsProduct[0].product_data.product_data.product_currency_code;
        });
      }

      this.differenceDate();
      this.checkPayment()
      this.getDoc();

    })


  }

  getDoc() {
    //669074
    this.purchaseAPIService.getDoc(this.RowID).subscribe(data => {
      this.arrDoc = data.response_data
      this.arrDoc.sort((a, b) => a.form_type_type_id - b.form_type_type_id);
      console.log(this.arrDoc);

    })
  }

  differenceDate() {
    const dateTime = new Date(this.arrBills.purchase_order_create * 1000);
    this.dueDate = dateTime.setDate(dateTime.getDate() + Number(this.arrBills.billing_payment_term));
    console.log('dueDate', this.dueDate);
    this.dueDateStatus = this.date_diff_indays(this.datepipe.transform(new Date(), 'MM/dd/yyyy'), this.datepipe.transform(new Date(this.dueDate), 'MM/dd/yyyy'))
    this.delivery_date = this.date_diff_indays(this.datepipe.transform(new Date(), 'MM/dd/yyyy'), this.datepipe.transform(new Date(this.arrBills.delivery_date * 1000), 'MM/dd/yyyy'));
    console.log('dueDateStatus', this.dueDateStatus);

  }

  date_diff_indays = (date1, date2) => {
    const dt1 = new Date(date1);
    const dt2 = new Date(date2);
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
  }


  checkPayment() {

    if (this.arrBills.purchase_order_paid_row !== undefined) {
      const total = this.arrBills.purchase_order_paid_row.reduce((prev: any, cur: any) => {
        return prev += (+cur.confirm_balance);
      }, 0);

      this.payment_total = (this.arrBillsSummary.total_grand - total) < 0 ? 0 : (this.arrBillsSummary.total_grand - total);
      this.over = this.arrBillsSummary.total_grand - total
      console.log('total', total);
    } else {
      this.payment_total = this.arrBillsSummary.total_grand;
    }

    this.loading = false;

  }

  sumTotal() {
    this.sum = 0;
    this.arrBillsProduct.forEach(x => this.sum += x.product_totalplice);
  }

  btnCancelClick() {
    this.router.navigate([this.UrlRouter_PurchaseList])

  }

  confirmPayment() {
    const data = {
      purchase_order_id: this.RowID,
      total_grand: this.arrBillsSummary.total_grand
    }
    const dialogRef = this.dialogService.open(ConfirmPaymentComponent, {
      context: {
        data: data,
        status: "confirmPayment",
      }
    });
    dialogRef.onClose.subscribe(result => {
      if (result === 'ok') {
        this.router.navigate([this.UrlRouter_PurchaseList])
      }

    });
  }

  openImg(img: any) {
    this.dialogService.open(DialogsImageComponent, {
      context: {
        imgURL: img,
      },
    });
  }

  btnDocClick(typeID) {
    if (typeID === 1) {
      this.router.navigate(["doucuments/purchase-order", this.RowID, typeID, 'bill']);
    }
    if (typeID === 2) {
      this.router.navigate(["doucuments/order-confirmation", this.RowID, typeID, 'bill']);
    }
    if (typeID === 3) {
      this.router.navigate(["doucuments/proforma-invoice", this.RowID, typeID, 'bill']);
    }
    if (typeID === 4) {
      this.router.navigate(["doucuments/commercial-invoice", this.RowID, typeID, 'bill']);
    }

  }


}
