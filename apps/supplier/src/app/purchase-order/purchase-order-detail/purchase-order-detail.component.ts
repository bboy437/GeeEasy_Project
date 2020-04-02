
import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { Router, ActivatedRoute } from '@angular/router';
import { PurchaseAPIService, SupplierAPIService } from '@project/services';
import { IPurchaseList } from '@project/interfaces';
import { DialogsImageComponent } from '../../dialogs/dialogs-image/dialogs-image.component';
import { DialogsConfirmPoComponent } from '../../dialogs/dialogs-confirm-po/dialogs-confirm-po.component';
import { TypeaheadMatch } from 'ngx-bootstrap';
import { DialogsReplyComponent } from '../../dialogs/dialogs-reply/dialogs-reply.component';
import { debounceTime, map, mergeMap, groupBy, toArray, reduce } from 'rxjs/operators';
import { Observable, from } from 'rxjs';
import { AleartComponent } from '../../dialogs/aleart/aleart.component';
import { DatePipe } from '@angular/common';

import { of } from 'rxjs';


@Component({
  selector: 'project-purchase-order-detail',
  templateUrl: './purchase-order-detail.component.html',
  styleUrls: ['./purchase-order-detail.component.scss']
})
export class PurchaseOrderDetailComponent implements OnInit {
  private UrlRouter_Purchase = "purchases/list";

  // date = new Date()
  // datetommorw = new Date(this.date.getTime() + (24*60*60*1000));;
  arrPurchase: any = [];
  arrPurchaseProduct: any = [];
  arrPurchaseOrderSummary: any = [];
  arrSupplier: any = [];
  arrProducts: any = [];
  arrProductsNew: any = [];
  checkin_receive_array: any = [];
  checkin_manual_array: any = [];
  purchase_order_paid_row: any = [];
  test: any = [];
  arrDoc: any = [];
  RowID: string;
  supplierName: string;
  selectedValue: string;
  openConfirm: boolean;
  openReply: boolean;
  delivery_date: number;
  isStatus = false;
  loading = false;

  dueDate: number;
  dueDateStatus: number;
  payment_total: number;
  over: number;

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? this.arrProducts
        : this.arrProducts.filter(v => v.product_name.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
          v.product_sku.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10),

      )
    )

  formatter = (x) => {
    console.log(x);

    if (x === '') { }
    else {
      const data = x;
      this.arrProductsNew.push(data);
      this.arrProductsNew.forEach(element => {
        element.product_qty = 1;
      });
      this.selectedValue = "";
    }
  }

  public onFocus(e: Event): void {
    e.stopPropagation();
    setTimeout(() => {
      const inputEvent: Event = new Event('input');
      e.target.dispatchEvent(inputEvent);
    }, 0);
  }



  constructor(
    private dialogService: NbDialogService,
    private router: Router,
    private purchaseAPIService: PurchaseAPIService,
    private route: ActivatedRoute,
    private supplierAPIService: SupplierAPIService,
    public datepipe: DatePipe,
  ) {
    this.loading = true;
  }

  ngOnInit() {
    this.getSupplier();
    const params = this.route.snapshot.paramMap;
    if (params.has("id")) {
      this.RowID = params.get("id");

      if (this.RowID === "new") {
      } else {
        this.getPurchaseDetail();
      }
    }


  }

  getPurchaseDetail() {
    this.purchaseAPIService.getPurchaseDetail(this.RowID).subscribe(data => {
      this.arrPurchase = data.response_data[0];
      console.log(this.arrPurchase);

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

      if (this.arrPurchase.button_array.supplier.reply === 0) {
        this.openReply = true;
      } else {
        this.openReply = false;
      }

      if (this.arrPurchase.button_array.supplier.confirm_delivery === 0) {
        this.openConfirm = true;
      } else {
        this.openConfirm = false;
      }

      if (this.arrPurchase.purchase_order_status_display.supplier_is_confirm === 1 || this.arrPurchase.purchase_order_status_display.po_is_delivery === 1) {
        this.isStatus = true;

      }

      this.arrPurchaseProduct = data.response_data[0].purchase_order_product_array;
      this.arrPurchaseOrderSummary = data.response_data[0].purchase_order_summary;
      this.arrPurchaseOrderSummary.product_currency_code = this.arrPurchaseProduct[0].product_data.product_data.product_currency_code;
      if (this.arrPurchase.purchase_order_paid_row.length > 0) {
        this.purchase_order_paid_row = data.response_data[0].purchase_order_paid_row;
        this.purchase_order_paid_row.forEach(element => {
          element.product_currency_code = this.arrPurchaseProduct[0].product_data.product_data.product_currency_code;
        });
      }
      
      this.checkin_receive_array = data.response_data[0].checkin_receive_array;
      this.checkin_manual_array = data.response_data[0].checkin_manual_array;
      this.getDoc(this.arrPurchase.purchase_order_id)
      this.getProductData();

      this.differenceDate();
      this.checkPayment()

      if (this.checkin_receive_array.length > 0) {
        this.checkReceive_Arrayf(this.checkin_receive_array)
      }

    })
  }

  //check Status Check-in
  checkReceive_Arrayf(checkin_receive_array) {
    console.log('checkin_receive_array', checkin_receive_array);

    const groupByName = [];
    const groupByGroup = [];

    checkin_receive_array.forEach((a) => {
      groupByName[a.product_id] = groupByName[a.product_id] || [];
      groupByName[a.product_id].push(a);
    });
    groupByName.forEach(element => {
      element.sort((a, b) => b.create_time - a.create_time);
      groupByGroup.push({
        product_title: element[0].product_title,
        product_sku: element[0].product_sku,
        product_image_url: element[0].product_image_url,
        product_id: element[0].product_id,
        checkin: element
      })
    });
    this.checkin_receive_array = groupByGroup;
    console.log(groupByName)
    console.log(groupByGroup)
    console.log(this.checkin_receive_array)
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
    console.log(this.arrPurchase.purchase_order_paid_row);

    if (this.arrPurchase.purchase_order_paid_row !== undefined)
      if (this.arrPurchase.purchase_order_paid_row.length > 0) {
        const total = this.arrPurchase.purchase_order_paid_row.reduce((prev: any, cur: any) => {
          return prev += (+cur.confirm_balance);
        }, 0);

        this.payment_total = (this.arrPurchaseOrderSummary.total_grand - total) < 0 ? 0 : (this.arrPurchaseOrderSummary.total_grand - total);
        this.over = this.arrPurchaseOrderSummary.total_grand - total;
        console.log('total', total);
      } else {
        this.payment_total = this.arrPurchaseOrderSummary.total_grand;
        this.over = 0;
      }

    this.loading = false;


  }

  getProductData() {

    this.arrPurchaseProduct.forEach(element => {
      element.request_product_price = element.request_product_price % 1 !== 0 ? element.request_product_price : element.request_product_price + ".00";
      element.product_default = element.request_product_qty;
      element.product_status = false;
    });
    console.log('arrPurchaseProduct', this.arrPurchaseProduct);

  }

  getDoc(value) {
    //'669074'
    this.purchaseAPIService.getDoc(this.RowID).subscribe(data => {
      this.arrDoc = data.response_data;
      this.arrDoc.sort((a, b) => a.form_type_type_id - b.form_type_type_id);
      console.log("this.arrDoc", this.arrDoc);
    })
  }

  btnDocClick(typeID) {
    if (typeID === 1) {
      this.router.navigate(["doucuments/purchase-order", this.RowID, typeID, "po"]);
    }
    if (typeID === 2) {
      this.router.navigate(["doucuments/order-confirmation", this.RowID, typeID, "po"]);
    }
    if (typeID === 3) {
      this.router.navigate(["doucuments/proforma-invoice", this.RowID, typeID, "po"]);
    }
    if (typeID === 4) {
      this.router.navigate(["doucuments/commercial-invoice", this.RowID, typeID, "po"]);
    }

  }

  btnConfirm() {
    const dialogRef = this.dialogService.open(DialogsConfirmPoComponent, {
      context: {
        data: this.arrPurchase.purchase_order_id,
        status: "confrim"
      }
    });
    dialogRef.onClose.subscribe(result => {
      this.getPurchaseDetail();
    });
  }

  btnReply() {
    const dialogRef = this.dialogService.open(DialogsReplyComponent, {
      context: {
        data: this.arrPurchase.purchase_order_id
      }
    });
    dialogRef.onClose.subscribe(result => {
      this.getPurchaseDetail();
    });
  }

  btnCancel() {
    this.router.navigate([this.UrlRouter_Purchase]);
  }

  openImg(data: any) {
    console.log('img', data);
    this.dialogService.open(DialogsImageComponent, {
      context: {
        data: data,
      },
    });
  }

  onKeyQuantity(searchValue, data: any): void {
    console.log(searchValue, data);

    //check Quantity เหมือนกัน
    if (data.request_product_qty === data.product_default) {
      console.log('a');

      data.product_status = false;
    } else {
      console.log('b');
      //check Quantity < 0 
      if (data.request_product_qty <= 0 || data.request_product_qty === "") {
        const dialogRef = this.dialogService.open(AleartComponent, {
          context: {
            status: 'Quantity',
          },
        });
        dialogRef.onClose.subscribe(result => {
          if (result === 'ok') {
            data.request_product_qty = data.product_default;
            data.product_status = false;
          }
        });
      }
      data.product_status = true;
    }

  }

  onKeyPrice(searchValue, data: any): void {
    console.log(data);
    data.product_status = true;
    if (data.request_product_price <= 0 || data.request_product_price === "") {
      const dialogRef = this.dialogService.open(AleartComponent, {
        context: {
          status: 'Price',
        },
      });
      dialogRef.onClose.subscribe(result => {
        if (result === 'ok') {
          data.request_product_price = 1;
        }
      });
    }
  }

  updatePO() {
    const dataJson = {
      "purchase_order_id": this.arrPurchase.purchase_order_id,
      "purchase_order_note": this.arrPurchase.purchase_order_note,
      "delivery_date": (new Date(this.delivery_date)).getTime() / 1000,
      "delivery_location": this.arrPurchase.delivery_location,
      "billing_name": this.arrPurchase.billing_name,
      "billing_address": this.arrPurchase.billing_address,
      "billing_payment_term": this.arrPurchase.billing_payment_term
    }
    const dataJsons = JSON.stringify(dataJson);
    console.log(dataJson);

    this.purchaseAPIService.updatePO(dataJsons).subscribe(data => {
      this.getPurchaseDetail();
    })
  }

  getSupplier() {
    const value = "cur_page=" + 1 + "&per_page=" + 10 + "&search_text=" + "" + "&distributor_id=" + 110 + "&product_category_id=" + 0;
    this.supplierAPIService.getVerifiedSupplieList(value).subscribe(data => {
      this.arrSupplier = data.response_data;
    })
  }

  SupplierID(id: string) {
    this.supplierAPIService.getSupID(id).subscribe(data => {
      const arrSupplierLists: any = data.response_data;
      this.getProduct(arrSupplierLists[0].supplier_product_array)
    })
  }

  getProduct(data) {
    console.log(data);
    this.arrProducts = data;
  }

  onSelectProducts(event: TypeaheadMatch): void {
    console.log(event.item);
    const data = event.item;
    this.arrProductsNew.push(data);
    this.arrProductsNew.forEach(element => {
      element.product_qty = 1;
    });
    this.selectedValue = "";

  }

  btnUpdateProduct(value) {
    console.log(value);
    value.loading = true;
    const dataJson = {
      "purchase_order_id": this.arrPurchase.purchase_order_id,
      "product_update_type_id": 1,
      "geeesy_purchase_order_product_id": value.geeesy_purchase_order_product_id,
      "create_time": value.create_time,
      "product_id": value.product_data.product_id,
      "product_sku": value.product_data.product_sku,
      "product_price": Number(value.request_product_price),
      "product_qty": value.request_product_qty,
      "product_note": value.product_note
    }
    const dataJsons = JSON.stringify(dataJson);
    this.purchaseAPIService.updateProduct(dataJsons).subscribe(data => {
      console.log(data);
      // this.getPurchaseDetail();
      value.loading = false;
      value.product_status = false;
      this.getProductData();

    })

  }

  btnAddProduct(value) {
    console.log(value);

    const dataJson = {
      "purchase_order_id": this.arrPurchase.purchase_order_id,
      "product_update_type_id": 2,
      "product_id": value.supplier_product_id,
      "product_sku": value.product_sku,
      "product_price": value.product_price,
      "product_qty": value.product_qty,
      "product_note": value.product_note
    }
    const dataJsons = JSON.stringify(dataJson);
    this.purchaseAPIService.updateProduct(dataJsons).subscribe(data => {
      this.arrProductsNew = [];
      console.log(data);
      this.getPurchaseDetail();

    })

  }

  btnDeleteProduct(value) {
    console.log(value);
    const dataJson = {
      "purchase_order_id": this.arrPurchase.purchase_order_id,
      "product_update_type_id": 3,
      "geeesy_purchase_order_product_id": value.geeesy_purchase_order_product_id,
      "create_time": value.create_time,
      "product_id": value.product_data.product_id,
      "product_sku": value.product_data.product_id,
      "product_price": value.request_product_price,
      "product_qty": value.request_product_qty,
    }
    const dataJsons = JSON.stringify(dataJson);

    this.purchaseAPIService.updateProduct(dataJsons).subscribe(data => {
      console.log(data);
      this.getPurchaseDetail();

    })

  }

  btnDeleteProductPre(i) {
    this.arrProductsNew.splice(i, 1);

  }

  updateProduct() {
    this.purchaseAPIService.updateProduct(1).subscribe(data => {
      this.getPurchaseDetail();

    })
  }

  updateSummaryReload(event) {
    this.loading = true;
    this.getPurchaseDetail();
  }


  btnNoteClick(data) {
    const dialogRef = this.dialogService.open(DialogsImageComponent, {
      context: {
        data: data,
        status: "note"
      },
    });
    dialogRef.onClose.subscribe(result => {
      console.log('result', result);
    });
  }

  btnImageClick(data) {
    const dialogRef = this.dialogService.open(DialogsImageComponent, {
      context: {
        data: data,
        status: "img"
      },
    });
    dialogRef.onClose.subscribe(result => {
      console.log('result', result);

    });

  }



}
