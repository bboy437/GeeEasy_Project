import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SupplierAPIService, PurchaseAPIService, ProductAPIService, DealerAPIService, OrderAPIService } from '@project/services';
import { WarehouseAPIService } from '@project/services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DialogsImageComponent } from '../../dialogs/dialogs-image/dialogs-image.component';
import { NbDialogService } from '@nebular/theme';
import { DialogsCancelComponent } from '../../dialogs/dialogs-cancel/dialogs-cancel.component';
import { Observable, Subject, merge } from 'rxjs';
import { debounceTime, map, distinctUntilChanged, filter } from 'rxjs/operators';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { SupplierCreateComponent } from '../../dialogs/supplier-create/supplier-create.component';
import { AleartComponent } from '../../dialogs/aleart/aleart.component';
import { INgxSelectOption } from 'ngx-select-ex';

const payment = ['1', '3', '7', '15', '30', '60', '90'];

@Component({
  selector: 'project-orders-save',
  templateUrl: './orders-save.component.html',
  styleUrls: ['./orders-save.component.scss']
})
export class OrdersSaveComponent implements OnInit {

  public payment: string[] = ['1', '3', '7', '15', '30', '60', '90'];
  private UrlRouter_Order = "orders/list";
  arrobjRow: any = {};
  objAPIResponse: any = {};
  arrDealer: any = [];
  arrProducts: any = [];
  arrProduct: any = [];
  arrobjRowProducts: any = [];
  arrobjRowProduct: any = [];
  arrWarehouse: any = [];
  arrSupplierLists: any = [];
  arrProductsName: any = [];
  arrDealerName: any = {};
  RowID: string
  delivery_date = new Date()
  isCheckPlice: boolean;
  numSales1: number;
  numSales2: number;
  selectedValue: any;
  selectedValue1: string;
  selectedOption: any;
  name: number;
  numQty: number;
  sum = 0;
  supplierName: string;
  supplierID: string;
  strProductGroup: string;
  strProductName: string;
  strTab: string;
  orderForm: FormGroup;
  submitted = false;
  test: any = {};
  minDate: Date;
  maxDate: Date

  id_local: string;

  @ViewChild('instance', { static: true }) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  // search3 = (text$: Observable<string>) => {
  //   const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
  //   const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
  //   const inputFocus$ = this.focus$;

  //   return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
  //     map(term => (term === '' ? payment
  //       : payment.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
  //   );
  // }


  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? this.arrProducts
        : this.arrProducts.filter(v => v.product_title.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
          v.product_sku.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10),

      )

    )

  formatter = (x) => {
    if (x === '') {
    }
    else {
      this.numQty = 1;
      this.btnAddProduct(x);
      this.clickQty(x);
      this.btnRefresh();
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
    private warehouseAPIService: WarehouseAPIService,
    private orderAPIService: OrderAPIService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private dialogService: NbDialogService,
    private productAPIService: ProductAPIService,
    private dealerAPIService: DealerAPIService,
  ) {

    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);
  }


  ngOnInit() {
    this.getDealer();
    this.builForm()
  }

  builForm() {
    this.orderForm = this.fb.group({
      DealerName: ['', Validators.required],
      BillingName: ['', Validators.required],
      BillingAddress: ['', Validators.required],
      deliveryDate: ['', Validators.required],
      BillingTerm: ['', Validators.required],
      Note: ['', Validators.required],
    });
    this.orderForm.get('deliveryDate').patchValue(new Date());
  }

  get f() { return this.orderForm.controls; }

  getDealer() {
    const value = "cur_page=" + 1 + "&per_page=" + 10;
    this.dealerAPIService.getDealerList(value).subscribe(data => {
      this.arrDealer = data.response_data;
      console.log(this.arrDealer);

    })
  }


  btnIDClick(options: INgxSelectOption[]) {
    console.log(options);
    if (options.length > 0) {
      this.arrDealerName = options[0].data;
      this.orderForm.get('BillingName').patchValue(options[0].data.dealer_name);
      this.orderForm.get('BillingAddress').patchValue(options[0].data.dealer_addr_full);

      if (this.arrobjRowProduct.length > 0) {
        const dialogRef = this.dialogService.open(AleartComponent, {
          context: {
            status: 'po',
          },
        });
        dialogRef.onClose.subscribe(result => {
          if (result === 'ok') {
            this.arrProducts = [];
            this.arrProductsName = [];
            this.arrobjRowProduct = [];
            this.selectedValue = "";
            this.strTab = "Product Name";
          }
        });
      } else {
        this.arrProducts = [];
        this.arrProductsName = [];
        this.arrobjRowProduct = [];
        this.selectedValue = "";
        this.strTab = "Product Name";
        this.getProduct();
      }
    } else {

      this.btnClear();

    }

  }

  getProduct() {
    const value = "cur_page=" + 1 + "&per_page=" + 50 + "&distributor_id=" + this.id_local;
    this.productAPIService.getProductOrder(value).subscribe(data => {
      if (data.response_data !== undefined) {
        this.arrProducts = data.response_data;
        this.arrProducts.forEach(element => {
          element.product_price = element.product_price_array[0]
        });
        console.log('product', this.arrProducts);
      }
    })
  }



  onChangeTab(event) {
    const e = event;
    this.selectedValue = "";
    this.selectedValue1 = "";
    this.strTab = e;
  }


  btnAddProduct(data: any) {
    console.log('data', data);

    const product = data;
    const arrobjProduct: any = {};
    arrobjProduct.product_name = product.product_title;
    arrobjProduct.product_sku = product.product_sku;
    arrobjProduct.product_qty = 1;
    arrobjProduct.product_price = product.product_price;
    arrobjProduct.product_image_url = product.product_image_url;
    arrobjProduct.product_totalplice = product.product_price;
    arrobjProduct.product_id = product.product_id;
    if (this.arrobjRowProduct.length === 0) {
      this.arrobjRowProduct.push(arrobjProduct);
      this.sumTotal();
    } else {
      this.arrobjRowProduct.push(arrobjProduct);
      if (this.arrobjRowProduct) {
        const array = this.arrobjRowProduct
        const arrayNew = new Map(array.map(obj => [obj.product_id, obj]));
        const arrayNews = Array.from(arrayNew.values());
        this.arrobjRowProduct = arrayNews;
        this.sumTotal();

      }

    }

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
          this.numQty = data.product_qty;
          this.clickQty(data);
        }
      });

    } else {
      this.numQty = data.product_qty;
      this.clickQty(data);
    }
  }

  onKeyPrice(searchValue, data: any): void {
    if (searchValue <= 0 || searchValue === "" || searchValue == "-") {
      const dialogRef = this.dialogService.open(AleartComponent, {
        context: {
          status: 'Quantity',
        },
      });
      dialogRef.onClose.subscribe(result => {
        if (result === 'ok') {
          data.product_price = 1;
          data.product_totalplice = 1;
        }
      });

    } else {
      // this.numQty = searchValue;
      this.clickQty(data);
    }
  }


  clickQty(value) {

    const productID = value.product_id;
    if (this.arrobjRowProduct.length > 0) {
      for (let i = 0; i < this.arrobjRowProduct.length; i++) {
        if (this.arrobjRowProduct[i].product_id === productID) {
          this.arrobjRowProduct[i].product_totalplice = (this.numQty * this.arrobjRowProduct[i].product_price)
        }
      }
    }
    this.sumTotal();
  }

  sumTotal() {
    this.sum = 0;
    this.arrobjRowProduct.forEach(x => this.sum += x.product_totalplice);
  }


  btnDeleteProduct(i) {
    this.sum = 0;
    this.arrobjRowProduct.splice(i, 1);
    this.arrobjRowProduct.forEach(x => this.sum += x.product_totalplice);

  }


  btnClear() {
    this.arrobjRow = [];
    this.arrobjRowProduct = [];
    this.arrDealerName = [];
    this.arrProducts = [];
    this.orderForm.get('DealerName').patchValue('');
    this.orderForm.get('BillingName').patchValue('');
    this.orderForm.get('BillingAddress').patchValue('');
    this.orderForm.get('deliveryDate').patchValue(new Date());
    this.orderForm.get('BillingTerm').patchValue('');
    this.orderForm.get('Note').patchValue('');
    this.supplierName = "";
    this.selectedValue = "";
    this.sum = 0;
  }



  btnSaveClick() {
    this.submitted = true;
    if (this.orderForm.invalid) {
      return;
    }
    if (this.arrobjRowProduct.length < 1) {
      return;
    }
    this.save();

  }

  save() {

    const param_product_json = [];
    for (let index = 0; index < this.arrobjRowProduct.length; index++) {
      param_product_json.push({
        product_id: this.arrobjRowProduct[index].product_id,
        product_name: this.arrobjRowProduct[index].product_name,
        product_sku: this.arrobjRowProduct[index].product_sku,
        product_price: this.arrobjRowProduct[index].product_price,
        product_qty: this.arrobjRowProduct[index].product_qty,
        product_image_url: this.arrobjRowProduct[index].product_image_url,
      });
    }

    this.arrobjRow.distributor_id = this.id_local;
    this.arrobjRow.supplier_id = 0;
    this.arrobjRow.dealer_id = this.arrDealerName.dealer_id;
    this.arrobjRow.billing_name = this.orderForm.value.BillingName;
    this.arrobjRow.billing_address = this.orderForm.value.BillingAddress;
    this.arrobjRow.billing_payment_term = this.orderForm.value.BillingTerm;
    this.arrobjRow.note = this.orderForm.value.Note;
    this.arrobjRow.product_json = param_product_json;
    this.arrobjRow.delivery_location = this.arrDealerName.dealer_addr_full;
    this.arrobjRow.delivery_date = (new Date(this.orderForm.value.deliveryDate)).getTime() / 1000;
    this.arrobjRow.sale_rep_id = 0;
    const dataJson = JSON.stringify(this.arrobjRow);
    console.log(this.arrobjRow);


    this.orderAPIService.newOrder(dataJson).subscribe(data => {
      this.router.navigate([this.UrlRouter_Order]);
    })

  }



  btnCancel() {
    const dialogRef = this.dialogService.open(DialogsCancelComponent, {
    });

    dialogRef.onClose.subscribe(result => {
      if (result === 'cancel') {
      }
      if (result === 'ok') {
        this.router.navigate([this.UrlRouter_Order]);
      }
    });
  }

  btnRefresh() {
    this.selectedValue = '';
  }


  openImg(img: any) {
    this.dialogService.open(DialogsImageComponent, {
      context: {
        imgURL: img,
      },
    });
  }

  updateMyDate(newDate) {
    console.log(newDate);
  }


  alert() {
    const dialogRef = this.dialogService.open(AleartComponent, {
    });

    dialogRef.onClose.subscribe(result => {
      if (result === 'ok') {
        // this.getSupplier();
      }
    });
  }


}

