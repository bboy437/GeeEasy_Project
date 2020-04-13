import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { Router, ActivatedRoute } from '@angular/router';
import { PurchaseAPIService, CheckinAPIService } from '@project/services';
import { IPurchaseList } from '@project/interfaces';
import { DialogsImageComponent } from '../../dialogs/dialogs-image/dialogs-image.component';
import { DialogsConfirmPoComponent } from '../../dialogs/dialogs-confirm-po/dialogs-confirm-po.component';
import { DatePipe } from '@angular/common'
import { DialogsCheckinStatusComponent } from '../../dialogs/dialogs-checkin-status/dialogs-checkin-status.component';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from "@angular/forms";

@Component({
  selector: 'project-purchase-order-detail',
  templateUrl: './purchase-order-detail.component.html',
  styleUrls: ['./purchase-order-detail.component.scss']
})
export class PurchaseOrderDetailComponent implements OnInit {
  private UrlRouter_Purchase = "purchases/list";
  private UrlRouter_CheckInDetail = "check-in/detail";
  private UrlRouter_CheckInList = "check-in/list";
  private UrlRouter_PurchaseReorder = "purchases/reorder";

  arrPurchase: any = [];
  arrPurchaseProduct: any = [];
  arrPurchaseOrderSummary: any = [];
  arrpurchase_order_paid_row: any = [];
  arrDoc: any = [];
  RowID: string;
  openConfirm = false;
  delivery_date: number;
  loading = false;
  strSupplierName: string;
  button_delivered: number;
  status: string;
  isStatus = false;
  isReorder = false;
  id_local: string;

  dueDate: number;
  dueDateStatus: number;
  payment_total: number;
  over: number;

  Form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialogService: NbDialogService,
    private router: Router,
    private purchaseAPIService: PurchaseAPIService,
    private route: ActivatedRoute,
    public datepipe: DatePipe,
    private checkinAPIService: CheckinAPIService,
  ) {
    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);
    this.loading = true;
  }

  ngOnInit() {
    this.buildForm();
    const params = this.route.snapshot.paramMap;
    if (params.has("id")) {
      this.RowID = params.get("id");
      this.status = params.get("status");

      if (this.RowID === "new") {
      } else {
        this.getPurchaseDetail();

      }
    }


  }

  getPurchaseDetail() {
    this.purchaseAPIService.getPurchaseDetail(this.RowID).subscribe(data => {
      console.log(data);

      this.arrPurchase = data.response_data[0];
      this.button_delivered = this.arrPurchase.order_status_btn.button_delivered;

      console.log(this.arrPurchase);
      this.strSupplierName = this.arrPurchase.supplier_data_array[0].supplier_name;
      // const date = new Date(this.arrPurchase.delivery_date * 1000)
      // this.delivery_date = this.datepipe.transform(date, 'dd/MM/yyyy');

      if (this.arrPurchase.purchase_order_reply_id === 0) {
        this.arrPurchase.status = "Waiting"
      }
      if (this.arrPurchase.purchase_order_reply_id === 1) {
        this.arrPurchase.status = "Confirmed"
      }
      if (this.arrPurchase.purchase_order_reply_id === 2) {
        this.arrPurchase.status = "In Negotiation"
      }
      if (this.arrPurchase.purchase_order_reply_id === 3) {
        this.arrPurchase.status = "Canceled"
      }

      if (this.arrPurchase.button_array.distributor.confirm === 0) {
        this.openConfirm = true;
      } else {
        this.openConfirm = false;
      }

      if (this.arrPurchase.purchase_order_status_display.supplier_is_confirm === 1 && this.arrPurchase.purchase_order_status_display.po_is_delivery === 1 && this.arrPurchase.purchase_order_status_display.po_is_invoice === 0) {
        this.isStatus = true;
      }
      if (this.arrPurchase.order_status_btn.button_paid === 1) {
        this.isReorder = true;
      }

      console.log('isStatus', this.isStatus);

      this.arrPurchaseProduct = data.response_data[0].purchase_order_product_array;
      this.arrPurchaseOrderSummary = data.response_data[0].purchase_order_summary;
      this.arrPurchaseOrderSummary.product_currency_code = this.arrPurchaseProduct[0].product_data.product_data.product_currency_code;
      if (this.arrPurchase.purchase_order_paid_row.length > 0) {
        this.arrpurchase_order_paid_row = this.arrPurchase.purchase_order_paid_row;
        this.arrpurchase_order_paid_row.forEach(element => {
          element.product_currency_code = this.arrPurchaseProduct[0].product_data.product_data.product_currency_code;
        });
      }


      this.getDoc(this.arrPurchase.purchase_order_id)
      this.differenceDate();
      this.checkPayment()
      this.detailForm();

    })
  }

  buildForm() {
    this.Form = this.formBuilder.group({
      purchase_order_number: [{ value: "", disabled: true }, Validators.required],
      delivery_location: [{ value: "", disabled: true }, Validators.required],
      billing_name: [{ value: "", disabled: true }, Validators.required],
      billing_address: [{ value: "", disabled: true }, Validators.required],
      billing_payment_term: [{ value: "", disabled: true }, Validators.required],
      purchase_order_reply_msg: [{ value: "", disabled: true }, Validators.required],
    });
  }

  detailForm() {
    this.Form.patchValue({
      purchase_order_number: this.arrPurchase.purchase_order_number,
      delivery_location: this.arrPurchase.delivery_location,
      billing_name: this.arrPurchase.billing_name,
      billing_address: this.arrPurchase.billing_address,
      billing_payment_term: this.arrPurchase.billing_payment_term,
      purchase_order_reply_msg: this.arrPurchase.purchase_order_reply_msg,
    });
  }


  differenceDate() {
    const dateTime = new Date(this.arrPurchase.purchase_order_create * 1000);
    this.dueDate = dateTime.setDate(dateTime.getDate() + Number(this.arrPurchase.billing_payment_term));
    console.log('dueDate', this.dueDate);
    this.dueDateStatus = this.date_diff_indays(this.datepipe.transform(new Date(), 'MM/dd/yyyy'), this.datepipe.transform(new Date(this.dueDate), 'MM/dd/yyyy'))
    this.delivery_date = this.date_diff_indays(this.datepipe.transform(new Date(), 'MM/dd/yyyy'), this.datepipe.transform(new Date(this.arrPurchase.delivery_date * 1000), 'MM/dd/yyyy'));
    console.log('dueDateStatus', this.dueDateStatus);
    console.log('delivery_date', this.delivery_date);

  }

  date_diff_indays = (date1, date2) => {
    const dt1 = new Date(date1);
    const dt2 = new Date(date2);
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
  }

  checkPayment() {
    if (this.arrPurchase.purchase_order_paid_row !== undefined) {
      // if (this.arrPurchase.purchase_order_paid_row.length > 0) {
      const total = this.arrPurchase.purchase_order_paid_row.reduce((prev: any, cur: any) => {
        return prev += (+cur.confirm_balance);
      }, 0);

      this.payment_total = (this.arrPurchaseOrderSummary.total_grand - total) < 0 ? 0 : (this.arrPurchaseOrderSummary.total_grand - total);
      this.over = this.arrPurchaseOrderSummary.total_grand - total;
      console.log('total', total);
      console.log('over', this.over);
    } else {
      this.payment_total = this.arrPurchaseOrderSummary.total_grand;
      this.over = 0;
    }

    this.loading = false;

  }

  getDoc(value) {
    //669074
    this.purchaseAPIService.getDoc(this.RowID).subscribe(data => {
      this.arrDoc = data.response_data
      this.arrDoc.sort((a, b) => a.form_type_type_id - b.form_type_type_id);
      console.log(this.arrDoc);

    })
    this.loading = false;
  }

  btnDocClick(typeID) {
    if (typeID === 1) {
      this.router.navigate(["doucuments/purchase-order", this.RowID, typeID, 'po']);
    }
    if (typeID === 2) {
      this.router.navigate(["doucuments/order-confirmation", this.RowID, typeID, 'po']);
    }
    if (typeID === 3) {
      this.router.navigate(["doucuments/proforma-invoice", this.RowID, typeID, 'po']);
    }
    if (typeID === 4) {
      this.router.navigate(["doucuments/commercial-invoice", this.RowID, typeID, 'po']);
    }

  }

  checkIn() {

    const value = "cur_page=" + 1 + "&per_page=" + 10 + "&distributor_id=" + this.id_local + "&purchase_order_id=" + this.RowID;
    this.checkinAPIService.getCheckinList(value).subscribe(res => {
      console.log(res);
      let check_in: any;
      check_in = res.response_data[0];
      console.log('check_in', check_in);


      if (check_in !== undefined) {
        const dialogRef = this.dialogService.open(DialogsCheckinStatusComponent, {
          context: {
            data: check_in.checkin_data_array[0].checkin_qty_done
          }
        });
        dialogRef.onClose.subscribe(result => {
          // tslint:disable-next-line: triple-equals
          if (result == "0") {
            this.router.navigate([this.UrlRouter_CheckInDetail, this.RowID, result]);
          }
          // tslint:disable-next-line: triple-equals
          if (result == "1") {
            this.router.navigate([this.UrlRouter_CheckInDetail, this.RowID, result]);
          }
        });
      }


    })

  }

  btnConfirm() {
    const dialogRef = this.dialogService.open(DialogsConfirmPoComponent, {
      context: {
        data: this.arrPurchase.purchase_order_id
      }
    });
    dialogRef.onClose.subscribe(result => {
      this.getPurchaseDetail();
    });
  }

  btnCancel() {
    if (this.status === 'po') {
      this.router.navigate([this.UrlRouter_Purchase]);
    } else {
      this.router.navigate([this.UrlRouter_CheckInList]);
    }
  }

  openImg(img: any) {
    this.dialogService.open(DialogsImageComponent, {
      context: {
        imgURL: img,
      },
    });
  }

  btnReorder() {
    this.router.navigate([this.UrlRouter_PurchaseReorder, "po", this.RowID]);
  }

}
