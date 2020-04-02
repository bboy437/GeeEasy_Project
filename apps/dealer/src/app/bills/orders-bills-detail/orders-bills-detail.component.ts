import { Component, OnInit } from '@angular/core';
import { DialogSuccessComponent } from '../../dialogs/dialog-success/dialog-success.component';
import { NbDialogService } from '@nebular/theme';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderAPIService } from '@project/services';
import { DialogsImageComponent } from '../../dialogs/dialogs-image/dialogs-image.component';
import { DatePipe } from '@angular/common';
import { DialogsConfirmOrderComponent } from '../../dialogs/dialogs-confirm-order/dialogs-confirm-order.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'project-orders-bills-detail',
  templateUrl: './orders-bills-detail.component.html',
  styleUrls: ['./orders-bills-detail.component.scss']
})
export class OrdersBillsDetailComponent implements OnInit {
  private UrlRouter_Purchase = "bills/order/list";
  Form: FormGroup;
  arrOrder: any = [];
  arrOrderProduct: any = [];
  arrOrderSummary: any = [];
  RowID: string;
  delivery_date: string
  loading = false;
  name: string

  constructor(
    private dialogService: NbDialogService,
    private router: Router,
    private orderAPIService: OrderAPIService,
    private route: ActivatedRoute,
    public datepipe: DatePipe,
    private fb: FormBuilder,
  ) {
    this.loading = true;
  }

  ngOnInit() {
    this.Builder();
    const params = this.route.snapshot.paramMap;
    if (params.has("id")) {
      this.RowID = params.get("id");
      this.name = params.get("name");
      console.log('this.name', this.name);

      if (this.RowID === "new") {
      } else {
        this.getOrderDetail();

      }
    }


  }

  Builder() {
    this.Form = this.fb.group({
      dealer_order_number: [{ value: '', disabled: true }, Validators.required],
      delivery_date: [{ value: '', disabled: true }, Validators.required],
      delivery_location: [{ value: '', disabled: true }, Validators.required],
      billing_name: [{ value: '', disabled: true }, Validators.required],
      billing_address: [{ value: '', disabled: true }, Validators.required],
      billing_payment_term: [{ value: '', disabled: true }, Validators.required],
      purchase_order_note: [{ value: '', disabled: true }, Validators.required],
    });
  }

  DetailForm() {
    this.Form.patchValue({
      dealer_order_number: this.arrOrder.dealer_order_number,
      delivery_date: this.delivery_date,
      delivery_location: this.arrOrder.delivery_location,
      billing_name: this.arrOrder.billing_name,
      billing_address: this.arrOrder.billing_address,
      billing_payment_term: this.arrOrder.billing_payment_term,
      purchase_order_note: this.arrOrder.purchase_order_note,
    });
    this.loading = false;
  }


  getOrderDetail() {
    this.orderAPIService.getOrderDetail(this.RowID).subscribe(data => {
      this.arrOrder = data.response_data[0];
      const date = new Date(this.arrOrder.delivery_date * 1000)
      this.delivery_date = this.datepipe.transform(date, 'dd/MM/yyyy');
      this.arrOrderProduct = data.response_data[0].dealer_order_product_array;
      this.arrOrderSummary = data.response_data[0].dealer_order_summary;
      console.log(this.arrOrder);
      console.log(this.arrOrderSummary);
      // this.loading = false;
      this.DetailForm();
    })
  }



  btnSuccess() {
    const dialogRef = this.dialogService.open(DialogSuccessComponent, {
    });
    dialogRef.onClose.subscribe(result => {
      this.router.navigate([this.UrlRouter_Purchase]);
    });
  }

  btnCancel() {
    if (this.name === "") {
      this.router.navigate([this.UrlRouter_Purchase]);
    } else {
      this.router.navigate([this.UrlRouter_Purchase, { id: this.name }]);
    }

  }

  confirmPaid() {
    const data = {
      dealer_order_id: this.RowID,
      total_grand: this.arrOrderSummary.total_grand
    }
    const dialogRef = this.dialogService.open(DialogsConfirmOrderComponent, {
      context: {
        data: data,
        status: "confirmPaid",
      }
    });
    dialogRef.onClose.subscribe(result => {
      if (result === 'ok') {
        this.getOrderDetail();
      }

    });
  }

  confirmDelivery() {
    const data = {
      dealer_order_id: this.RowID,
      total_grand: this.arrOrderSummary.total_grand
    }
    const dialogRef = this.dialogService.open(DialogsConfirmOrderComponent, {
      context: {
        data: data,
        status: "confirmDelivery",
      }
    });
    dialogRef.onClose.subscribe(result => {
      if (result === 'ok') {
        this.getOrderDetail();
      }

    });
  }

  confirmOrder() {
    const data = {
      dealer_order_id: this.RowID,
    }
    const dialogRef = this.dialogService.open(DialogsConfirmOrderComponent, {
      context: {
        data: data,
        status: "confirmOrder",
      }
    });
    dialogRef.onClose.subscribe(result => {
      if (result === 'ok') {
        this.getOrderDetail();
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

}

