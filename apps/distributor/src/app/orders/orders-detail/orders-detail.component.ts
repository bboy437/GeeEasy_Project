import { Component, OnInit } from '@angular/core';
import { DialogSuccessComponent } from '../../dialogs/dialog-success/dialog-success.component';
import { NbDialogService } from '@nebular/theme';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderAPIService } from '@project/services';
import { DialogsImageComponent } from '../../dialogs/dialogs-image/dialogs-image.component';
import { DatePipe } from '@angular/common';
import { DialogsConfirmOrderComponent } from '../../dialogs/dialogs-confirm-order/dialogs-confirm-order.component';
import { AleartComponent } from '../../dialogs/aleart/aleart.component';

@Component({
  selector: 'project-orders-detail',
  templateUrl: './orders-detail.component.html',
  styleUrls: ['./orders-detail.component.scss']
})
export class OrdersDetailComponent implements OnInit {
  private UrlRouter_Purchase = "orders/list";

  // date = new Date()
  // datetommorw = new Date(this.date.getTime() + (24*60*60*1000));;
  arrOrder: any = [];
  arrOrderProduct: any = [];
  arrOrderSummary: any = [];
  RowID: string;
  delivery_date: string
  loading = false;
  loading1 = false;
  name: string
  sum: number;

  constructor(
    private dialogService: NbDialogService,
    private router: Router,
    private orderAPIService: OrderAPIService,
    private route: ActivatedRoute,
    public datepipe: DatePipe
  ) {
    this.loading = true;
  }

  ngOnInit() {
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

  getOrderDetail() {
    this.orderAPIService.getOrderDetail(this.RowID).subscribe(data => {
      this.arrOrder = data.response_data[0];
      const date = new Date(this.arrOrder.delivery_date * 1000)
      this.delivery_date = this.datepipe.transform(date, 'dd/MM/yyyy');
      this.arrOrderProduct = data.response_data[0].dealer_order_product_array;
      this.arrOrderProduct.forEach(element => {
        element.product_total = Number(element.product_price);
      });
      this.arrOrderSummary = data.response_data[0].dealer_order_summary;
      this.sumTotal()
      console.log(this.arrOrder);
      console.log(this.arrOrderSummary);
      this.loading = false;
      this.loading1 = false;
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

  onKeyQTY(searchValue, data: any): void {

    if (searchValue <= 0 || searchValue === "") {
      const dialogRef = this.dialogService.open(AleartComponent, {
        context: {
          status: 'Quantity',
        },
      });
      dialogRef.onClose.subscribe(result => {
        if (result === 'ok') {
          data.product_qty = 1;
          data.product_qty = data.product_qty;
          data.product_total = (data.product_qty * data.product_price)
          this.sumTotal();
        }
      });

    } else {
      data.product_qty = data.product_qty;
      data.product_total = (data.product_qty * data.product_price)
      this.sumTotal();
    }
    console.log('arrOrderProduct', this.arrOrderProduct);

  }

  onKeyPrice(searchValue, data: any): void {
    if (searchValue <= 0 || searchValue === "" || searchValue === "-") {
      const dialogRef = this.dialogService.open(AleartComponent, {
        context: {
          status: 'Quantity',
        },
      });
      dialogRef.onClose.subscribe(result => {
        if (result === 'ok') {
          data.product_price = 1;
          data.product_total = 1;
          data.product_total = (data.product_qty * data.product_price)
          this.sumTotal();
        }
      });

    } else {
      data.product_price = data.product_price;
      data.product_total = (data.product_qty * data.product_price)
      this.sumTotal();
    }
    console.log('arrOrderProduct', this.arrOrderProduct);
  }



  sumTotal() {
    this.sum = 0;
    this.arrOrderProduct.forEach(x => this.sum += x.product_total);
  }

  updatePrice() {
    const dataJson = {
      "dealer_order_id": this.arrOrder.dealer_order_id,
      "product_json": this.arrOrderProduct
    }

    console.log('dataJson', dataJson);
    this.loading1 = true;
    this.orderAPIService.comfirmPrice(JSON.stringify(dataJson)).subscribe(data => {
      this.getOrderDetail();
    })
  }




}

