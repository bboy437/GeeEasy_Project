import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SupplierAPIService, PurchaseAPIService, ProductAPIService } from '@project/services';
import { WarehouseAPIService } from '@project/services';
import { TypeaheadMatch } from 'ngx-bootstrap';
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


@Component({
  selector: 'project-purchase-order-save',
  templateUrl: './purchase-order-save.component.html',
  styleUrls: ['./purchase-order-save.component.scss'],
})
export class PurchaseOrderSaveComponent implements OnInit {
  // const payment = ['1', '3', '7', '15', '30', '60', '90'];
  public payment: string[] = ['1', '3', '7', '15', '30', '60', '90'];

  private UrlRouter_Purchase = "purchases/list";
  arrobjRow: any = {};
  objAPIResponse: any = {};
  arrSupplier: any = [];
  arrProducts: any = [];
  arrProductsFilter: any = [];
  arrobjRowProducts: any = [];
  arrobjRowProduct: any = [];
  arrWarehouse: any = [];
  arrSupplierLists: any = [];
  arrWholesale: any = [];
  arrProductsGroup: any = [];
  arrProductsName: any = [];
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
  currencyTotal = "THB";
  sum = 0;
  supplierName: string;
  supplierID: string;
  strProductGroup: string;
  strProductName: string;
  strTab: string;
  Form: FormGroup;
  submitted = false;
  isSaveLodding = false;
  test: any = {};
  minDate: Date;
  maxDate: Date

  model: any;
  id_local: string;

  dte = new Date();
  millisecondPerDay = 24 * 60 * 60 * 1000;
  disabledDates = [];

  @ViewChild('instance', { static: true }) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();


  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? this.arrProducts
        : this.arrProducts.filter(v => v.product_name.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
          v.product_sku.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10),

      )

    )
  search1 = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? this.arrProductsName
        : this.arrProductsName.filter(v => v.product_name.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
          v.product_sku.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
      )

    )
  formatter = (x) => {
    if (x === '') {
    }
    else {
      this.numQty = 1;
      this.btnAddProduct(x);
      this.selectedValue = "";
      this.clickQty(x);
    }
  }

  formatter1 = (x1) => {
    if (x1 === '') { }
    else {
      // this.numQty = 1;
      this.btnAddProduct(x1);
      this.clickQty(x1);
      this.selectedValue1 = "";
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
    private supplierAPIService: SupplierAPIService,
    private warehouseAPIService: WarehouseAPIService,
    private purchaseAPIService: PurchaseAPIService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private dialogService: NbDialogService,
    private productAPIService: ProductAPIService
  ) {
    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);

    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate.setMonth(this.minDate.getMonth() - 1);
    this.maxDate.setMonth(this.maxDate.getMonth() + 1);
    console.log(this.minDate);
  }


  ngOnInit() {
    this.getSupplier();
    this.getWarehouse();
    this.builForm();
    this.getDisabledDates();
  }

  getDisabledDates() {
    const now = new Date();
    let startDate: Date = new Date(now.setFullYear(now.getFullYear() - 10));
    const endDate: Date = new Date();//change as per your need
    const enabledDates = [new Date()]
    console.log(startDate);
    console.log(endDate);

    do {
      let found = false;
      for (let i = 0; i < enabledDates.length; i++) {
        const excludeDate: Date = enabledDates[i];
        if (this.IsSameDay(excludeDate, startDate)) {
          found = true;
        }
      }

      if (!found) {
        this.disabledDates.push(startDate);
      }
      startDate = new Date((startDate.getTime() + this.millisecondPerDay));
    } while (startDate <= endDate)

  }


  IsSameDay(date1: Date, date2: Date) {
    if (date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate()) {
      return true;
    }
    else {
      return false;
    }
  }

  builForm() {
    this.Form = this.fb.group({
      SupplierName: ['', Validators.required],
      SupplierName1: [],
      BillingName: ['', Validators.required],
      BillingAddress: ['', Validators.required],
      deliveryDate: ['', Validators.required],
      BillingTerm: ['', Validators.required],
      WarehouseName: ['', Validators.required],
      Note: ['', Validators.required],

    });
    this.Form.get('deliveryDate').patchValue(new Date());
    // this.Form.get('WarehouseName').patchValue(0);
  }

  get f() { return this.Form.controls; }

  getSupplier() {
    const value = "cur_page=" + 1 + "&per_page=" + 100 + "&search_text=" + "" + "&distributor_id=" + this.id_local + "&product_category_id=" + 0;
    this.supplierAPIService.getVerifiedSupplieList(value).subscribe(data => {
      this.arrSupplier = data.response_data;
    })
  }


  btnIDClick(options: INgxSelectOption[]) {
    console.log(this.strTab);
    if (options.length > 0) {
      console.log(options[0].data);

      //Check เมื่อมีการเลือกซ้ำ
      if (this.arrobjRowProduct.length > 0) {

        //Check เมื่อเลือกแล้วมีการเปลื่อนแต่กด cancel
        if (this.Form.value.SupplierName1 !== options[0].data.supplier_id) {
          const dialogRef = this.dialogService.open(AleartComponent, {
            context: {
              status: 'po',
            },
          });
          dialogRef.onClose.subscribe(result => {
            if (result === 'ok') {
              this.supplierID = options[0].data.supplier_id;
              this.Form.get('SupplierName1').patchValue(options[0].data.supplier_id);
              this.arrProducts = [];
              this.arrProductsName = [];
              this.arrProductsGroup = [];
              this.arrobjRowProduct = [];
              this.selectedValue = "";
              this.selectedValue1 = "";
              this.strProductGroup = "";
              this.currencyTotal = "THB";
              if (this.strTab === "Product Group Name") {
                this.strTab = "Product Group Name";
              } else {
                this.strTab = "Product Name";
              }
              this.supplierAPIService.getSupID(options[0].data.supplier_id).subscribe(data => {
                this.arrSupplierLists = data.response_data;
                this.getProduct(this.arrSupplierLists[0].supplier_product_array)
              })
              this.getProductGroup();
              this.getSetting();
            }
            this.clearName(this.Form.value.SupplierName1);
          });

        }
      } else {
        this.supplierID = options[0].data.supplier_id;
        this.Form.get('SupplierName1').patchValue(options[0].data.supplier_id);
        this.arrProducts = [];
        this.arrProductsName = [];
        this.arrProductsGroup = [];
        this.arrobjRowProduct = [];
        this.selectedValue = "";
        this.selectedValue1 = "";
        this.strProductGroup = "";
        this.currencyTotal = "THB";
        if (this.strTab === "Product Group Name") {
          this.strTab = "Product Group Name";
        } else {
          this.strTab = "Product Name";
        }
        this.supplierAPIService.getSupID(options[0].data.supplier_id).subscribe(data => {
          this.arrSupplierLists = data.response_data;
          this.getProduct(this.arrSupplierLists[0].supplier_product_array)
        })
        this.getProductGroup();
        this.getSetting();
      }
    } else {
      this.btnClear();
    }

  }

  clearName(supplier_id) {
    this.Form.get('SupplierName').patchValue(supplier_id);
  }

  // btnIDClick(id: string) {
  //   this.supplierID = id;

  //   if (this.arrobjRowProduct.length > 0) {
  //     const dialogRef = this.dialogService.open(AleartComponent, {
  //       context: {
  //         status: 'po',
  //       },
  //     });
  //     dialogRef.onClose.subscribe(result => {
  //       if (result === 'ok') {
  //         this.arrProducts = [];
  //         this.arrProductsName = [];
  //         this.arrProductsGroup = [];
  //         this.arrobjRowProduct = [];
  //         this.selectedValue = "";
  //         this.selectedValue1 = "";
  //         this.strProductGroup = "";
  //         this.strTab = "Product Name";
  //       }
  //     });
  //   } else {
  //     this.arrProducts = [];
  //     this.arrProductsName = [];
  //     this.arrProductsGroup = [];
  //     this.arrobjRowProduct = [];
  //     this.selectedValue = "";
  //     this.selectedValue1 = "";
  //     this.strProductGroup = "";
  //     this.strTab = "Product Name";
  //     this.supplierAPIService.getSupID(id).subscribe(data => {
  //       this.arrSupplierLists = data.response_data;
  //       this.getProduct(this.arrSupplierLists[0].supplier_product_array)
  //     })
  //     this.getProductGroup();
  //     this.getSetting();
  //   }
  // }

  getProduct(data) {
    this.arrProducts = data;
    this.arrProductsFilter = data;
    console.log('arrProducts', this.arrProducts);

  }

  getProductGroup() {
    const value = "cur_page=" + 1 + "&per_page=" + 10 + "&distributor_id=" + this.id_local;
    this.productAPIService.getProductGroup(value).subscribe(data => {
      this.arrProductsGroup = data.response_data;
    })
  }


  btnProductGroup(inventory_group_array: any) {
    const data = inventory_group_array;
    if (data.length > 0) {
      for (let index = 0; index < data.length; index++) {
        // tslint:disable-next-line: triple-equals
        if (data[index].supplier_id == this.supplierID) {
          const dataProduct: any = {};
          dataProduct.product_image_url = data[index].product_image_url;
          dataProduct.product_name = data[index].product_title;
          dataProduct.product_price = data[index].product_price;
          dataProduct.product_status = data[index].product_status;
          dataProduct.supplier_id = data[index].supplier_id;
          dataProduct.supplier_product_id = data[index].product_id;
          dataProduct.product_sku = data[index].product_sku;
          dataProduct.create_time = data[index].create_time;
          dataProduct.product_wholesale_array = [{
            "product_price": data[index].product_price,
            "qty_minimum": 1
          }];

          this.arrProductsName.push(dataProduct)
          console.log(this.arrProductsName);
        }
      }
    }
  }



  getSetting() {
    const value = this.id_local;
    this.purchaseAPIService.getSettingDist(value).subscribe(data => {
      console.log(data);
      console.log(JSON.stringify(data));

      this.Form.get('BillingAddress').patchValue(data.response_data[0].setting_data[0].billing_address);
      this.Form.get('BillingName').patchValue(data.response_data[0].setting_data[0].billing_name);

      // this.arrobjRow.billing_payment_term = data.response_data[0].setting_data[0].billing_payment_term;
    })

  }


  getWarehouse() {
    const value = "distributor_id=" + this.id_local + "&warehouse_type_id=" + 2
    this.warehouseAPIService.getWarehouseList(value).subscribe(data => {
      this.arrWarehouse = data.response_data;
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
    arrobjProduct.product_name = product.product_name;
    arrobjProduct.product_sku = product.product_sku;
    arrobjProduct.product_qty = 1;
    arrobjProduct.product_unit = product.product_unit;
    arrobjProduct.product_price = product.product_price;
    arrobjProduct.product_image_url = product.product_image_url;
    arrobjProduct.product_wholesale_array = product.product_wholesale_array;
    arrobjProduct.product_totalplice = product.product_price;
    arrobjProduct.supplier_product_id = product.supplier_product_id;
    arrobjProduct.product_currency_code = product.product_currency_code;

    console.log("btnAddProduct : arrobjProduct : ", arrobjProduct);
    this.currencyTotal = product.product_currency_code;

    if (this.arrobjRowProduct.length === 0) {
      this.arrobjRowProduct.push(arrobjProduct);
      this.sumTotal();
      this.checkCurrency();
    } else {
      this.arrobjRowProduct.push(arrobjProduct);
      if (this.arrobjRowProduct) {
        const array = this.arrobjRowProduct
        const arrayNew = new Map(array.map(obj => [obj.supplier_product_id, obj]));
        const arrayNews = Array.from(arrayNew.values());
        this.arrobjRowProduct = arrayNews;
        this.sumTotal();
        this.checkCurrency();

      }

    }
    console.log('arrobjRowProduct', this.arrobjRowProduct);

  }

  checkCurrency() {
    //Check Currency
    if (this.arrobjRowProduct.length > 0) {
      this.arrProducts = this.arrProductsFilter.filter((cur) => cur.product_currency_code === this.currencyTotal)
    } else {
      this.arrProducts = this.arrProductsFilter;
    }

    console.log("arrProducts ", this.arrProducts);
  }


  btnSelectWholesale(data: any) {
    this.arrWholesale = data;
  }

  onSearchChange(searchValue, data: any): void {
    // tslint:disable-next-line: triple-equals
    console.log(data);

    if (data.product_qty <= 0 || data.product_qty === "" || data.product_qty == "-") {
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

  keyDown(e, value) {
    console.log(e);
    console.log(value);
    // tslint:disable-next-line: triple-equals
    if (e.key == "-" || e.key == 0) {
      return false;
    }

  }


  clickQty(value) {

    const productID = value.supplier_product_id;
    const dataminimum: any = [] = value.product_wholesale_array;
    console.log('dataminimum', dataminimum);
    console.log('numQty', this.numQty);

    if (this.arrobjRowProduct.length > 0) {
      for (let i = 0; i < this.arrobjRowProduct.length; i++) {
        if (this.arrobjRowProduct[i].supplier_product_id === productID) {

          this.arrobjRowProduct[i].isCheckPlice = true;
          this.arrobjRowProduct[i].numSales = this.arrobjRowProduct[i].product_price;

          if (dataminimum.length > 0) {
            //Check wholesale
            for (let index = 0; index < dataminimum.length; index++) {
              if (dataminimum[index].qty_minimum <= this.numQty) {
                const dataminimums = dataminimum[index]
                this.arrobjRowProduct[i].product_totalplice = (this.numQty * dataminimums.product_price)
                this.arrobjRowProduct[i].numSales = dataminimums.product_price;
                // tslint:disable-next-line: triple-equals
                if (this.arrobjRowProduct[i].product_price == dataminimums.product_price) {
                  this.arrobjRowProduct[i].isCheckPlice = true;
                } else {
                  this.arrobjRowProduct[i].isCheckPlice = false;
                }
              }
            }
          } else {
            this.arrobjRowProduct[i].product_totalplice = (this.numQty * this.arrobjRowProduct[i].product_price)
            this.arrobjRowProduct[i].numSales = this.arrobjRowProduct[i].product_price;
          }
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
    if (this.arrobjRowProduct.length === 0) {
      this.currencyTotal = "THB";
      this.arrProducts = this.arrProductsFilter;
    }

  }

  btnClearAll() {
    this.arrobjRowProduct = [];
    this.currencyTotal = "THB";
    this.arrProducts = this.arrProductsFilter;
  }


  btnClear() {
    this.arrobjRow = [];
    this.arrobjRowProduct = [];
    this.currencyTotal = "THB";
    this.Form.get('SupplierName').patchValue('');
    this.Form.get('BillingName').patchValue('');
    this.Form.get('BillingAddress').patchValue('');
    this.Form.get('deliveryDate').patchValue(new Date());
    this.Form.get('BillingTerm').patchValue('');
    this.Form.get('WarehouseName').patchValue('');
    this.Form.get('Note').patchValue('');
    this.selectedValue = "";
    this.strProductGroup = "";
    this.strProductName = "";
    this.sum = 0;
  }



  btnSaveClick() {
    console.log(this.Form.value);

    this.submitted = true;
    if (this.Form.invalid) {
      return;
    }
    if (this.arrobjRowProduct.length < 1) {
      return;
    }
    this.isSaveLodding = true;

     this.save();

  }

  save() {
    console.log('yes');

    // console.log(this.arrobjRowProduct);
    // const param_product_json = JSON.stringify(this.arrobjRowProduct);
    const param_product_json = [];
    for (let index = 0; index < this.arrobjRowProduct.length; index++) {
      param_product_json.push({
        product_price: this.arrobjRowProduct[index].numSales,
        product_sku: this.arrobjRowProduct[index].product_sku,
        product_qty: this.arrobjRowProduct[index].product_qty,
        product_name: this.arrobjRowProduct[index].product_name,
      });
    }

    this.arrobjRow.distributor_id = this.id_local;
    this.arrobjRow.supplier_id = this.supplierID;
    this.arrobjRow.product_json = param_product_json;
    this.arrobjRow.billing_name = this.Form.value.BillingName;
    this.arrobjRow.billing_address = this.Form.value.BillingAddress;
    this.arrobjRow.delivery_location = this.arrSupplierLists[0].supplier_addr_full;
    this.arrobjRow.delivery_date = (new Date(this.Form.value.deliveryDate)).getTime() / 1000;
    this.arrobjRow.billing_payment_term = this.Form.value.BillingTerm;
    this.arrobjRow.warehouse_id = this.Form.value.WarehouseName;
    this.arrobjRow.note = this.Form.value.Note;
    this.arrobjRow.sale_rep_id = 0;
    const dataJson = JSON.stringify(this.arrobjRow);

    console.log(this.arrobjRow);


    this.purchaseAPIService.addPurchase(dataJson).subscribe(data => {
      this.isSaveLodding = false;
      this.router.navigate([this.UrlRouter_Purchase]);
    })
    // this.saveSetting()

  }

  saveSetting() {
    const dataJson = {
      distributor_id: this.id_local,
      setting_json: [
        {
          billing_payment_term: this.Form.value.BillingTerm,
          billing_name: this.Form.value.BillingName,
          billing_address: this.Form.value.BillingAddress,
          warehouse_id: this.Form.value.WarehouseName,
        }
      ]
    }
    console.log('dataJson', dataJson);


    this.purchaseAPIService.addSettingDist(JSON.stringify(dataJson)).subscribe(data => {
      this.router.navigate([this.UrlRouter_Purchase]);
    })
  }


  btnCancel() {
    const dialogRef = this.dialogService.open(DialogsCancelComponent, {
    });

    dialogRef.onClose.subscribe(result => {
      if (result === 'cancel') {
      }
      if (result === 'ok') {
        this.router.navigate([this.UrlRouter_Purchase]);
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

  updateMyDate(newDate) {
    console.log(newDate);
  }


  createSupplier() {
    const dialogRef = this.dialogService.open(SupplierCreateComponent, {
    });

    dialogRef.onClose.subscribe(result => {
      if (result === 'ok') {
        this.getSupplier();
      }
    });
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

  btnRefresh() {
    this.selectedValue1 = "";
    this.selectedValue = "";
  }

  clickPayment(event) {
    console.log(event);
    this.Form.get('BillingTerm').patchValue(event);
  }



}
