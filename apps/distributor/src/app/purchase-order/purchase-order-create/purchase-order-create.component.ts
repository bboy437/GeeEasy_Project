import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SupplierAPIService, PurchaseAPIService } from '@project/services';
import { WarehouseAPIService, ProductAPIService } from '@project/services';
import { TypeaheadMatch } from 'ngx-bootstrap';
import { DialogsImageComponent } from '../../dialogs/dialogs-image/dialogs-image.component';
import { NbDialogService } from '@nebular/theme';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { SupplierCreateComponent } from '../../dialogs/supplier-create/supplier-create.component';
import { AleartComponent } from '../../dialogs/aleart/aleart.component';
import { INgxSelectOption } from 'ngx-select-ex';



@Component({
  selector: 'project-purchase-order-create',
  templateUrl: './purchase-order-create.component.html',
  styleUrls: ['./purchase-order-create.component.scss']
})
export class PurchaseOrderCreateComponent implements OnInit {

  public payment: string[] = ['1', '3', '7', '15', '30', '60', '90'];
  private UrlRouter_Purchase = "purchases/list";
  supplierNameForm: FormGroup;
  productsForm: FormGroup;
  confirmForm: FormGroup;
  arrobjRow: any = {};
  arrSupplier: any = [];
  arrSupplierList: any = [];
  arrProducts: any = [];
  arrProductsFilter: any = [];
  arrSupplierLists: any = [];
  arrWarehouse: any = [];
  submitted = false;
  submittedconfirm = false;
  isSaveLodding = false;
  arrWholesale: any = [];
  arrProductsGroup: any = [];
  arrProductsName: any = [];
  strProductGroup: string;
  strProductName: string;
  supplierID: string;
  name: number;
  numQty = 1;
  isCheckSupplierList: string;
  currencyTotal = "THB";
  sum = 0;
  productsName: string;
  productsName1: string;
  supplierName: string;
  strTab: string;
  DeliveryDate: string;
  BillingTerm: string;
  BillingName: string;
  BillingAddress: string;
  delivery_date = new Date()

  dte = new Date();
  millisecondPerDay = 24 * 60 * 60 * 1000;
  disabledDates = [];

  id_local: string;

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? this.arrProducts
        : this.arrProducts.filter(v => v.product_name.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
          v.product_sku.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
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
    if (x === '') { }
    else {
      this.numQty = 1;
      this.btnAddProduct(x);
      this.clickQty(x);
      this.productsName = "";
      this.productsForm.get("productsCtrl").patchValue("yes");
    }
  }

  formatter1 = (x1) => {
    if (x1 === '') { }
    else {
      this.numQty = 1;
      this.btnAddProduct(x1);
      this.clickQty(x1);
      this.productsName1 = "";
      this.productsForm.get("productsCtrl").patchValue("yes");
    }
  }

  public onFocus(e: Event): void {
    e.stopPropagation();
    setTimeout(() => {
      const inputEvent: Event = new Event('input');
      e.target.dispatchEvent(inputEvent);
    }, 0);
  }

  constructor(private fb: FormBuilder,
    private supplierAPIService: SupplierAPIService,
    private purchaseAPIService: PurchaseAPIService,
    private warehouseAPIService: WarehouseAPIService,
    private router: Router,
    private route: ActivatedRoute,
    private productAPIService: ProductAPIService,
    private dialogService: NbDialogService,
  ) {
    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);
  }

  ngOnInit() {
    this.getSupplier();
    this.getWarehouse();
    this.arrobjRow.warehouse_id = 0;
    this.supplierNameForm = this.fb.group({
      supplierNameCtrl: ['', Validators.required],
      SupplierName1: [],
      supplier_name: [{ value: '', disabled: true }],
      supplier_name_first: [{ value: '', disabled: true }],
      supplier_name_last: [{ value: '', disabled: true }],
      supplier_company_contact: [{ value: '', disabled: true }],
      supplier_addr_phone: [{ value: '', disabled: true }],
      supplier_tel: [{ value: '', disabled: true }],
      supplier_addr_full: [{ value: '', disabled: true }],
      supplier_addr_number: [{ value: '', disabled: true }],
      supplier_addr_tambon: [{ value: '', disabled: true }],
      supplier_addr_amphoe: [{ value: '', disabled: true }],
      supplier_addr_province: [{ value: '', disabled: true }],
      supplier_addr_postcode: [{ value: '', disabled: true }],
    });
    this.productsForm = this.fb.group({
      productsCtrl: [null, Validators.required],
      products: this.fb.array([])
    });
    this.confirmForm = this.fb.group({
      DeliveryDate: ['', Validators.required],
      BillingTerm: ['', Validators.required],
      BillingName: ['', Validators.required],
      BillingAddress: ['', Validators.required],
      WarehouseName: ['', Validators.required],
      Note: ['', Validators.required],
    });
    this.confirmForm.get('DeliveryDate').patchValue(new Date());

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

  get products(): FormArray {
    return this.productsForm.get('products') as FormArray;
  }

  get f() { return this.supplierNameForm.controls; }
  get p() { return this.productsForm.controls; }
  get c() { return this.confirmForm.controls; }

  // onSupplierNameSubmit() {
  //   this.submitted = true;
  //   if (this.supplierNameForm.invalid) {
  //     return;
  //   }
  // }

  btnClickSupplierName() {
    this.submitted = true;
    if (this.supplierNameForm.invalid) {
      return;
    } else {
      this.supplierNameForm.markAsDirty();
    }
  }

  btnClickProduct() {
    this.submitted = true;
    if (this.productsForm.invalid) {
      return;
    }
    this.productsForm.markAsDirty();
  }

  btnClickonConfirmSubmit() {
    this.submittedconfirm = true;
    if (this.confirmForm.invalid) {
      return;
    }
    this.btnSaveClick();
    this.confirmForm.markAsDirty();
  }

  getSupplier() {
    const value = "cur_page=" + 1 + "&per_page=" + 100 + "&search_text=" + "" + "&distributor_id=" + this.id_local + "&product_category_id=" + 0;
    this.supplierAPIService.getVerifiedSupplieList(value).subscribe(data => {
      this.arrSupplier = data.response_data;
      console.log('arrSupplier', this.arrSupplier);
    })
  }

  getWarehouse() {
    const value = "distributor_id=" + this.id_local + "&warehouse_type_id=" + 2
    this.warehouseAPIService.getWarehouseList(value).subscribe(data => {
      this.arrWarehouse = data.response_data;
    })
  }
  // public doSelectOptions = (options: INgxSelectOption[]) => console.log('SingleDemoComponent.doSelectOptions', options[0].data);

  btnIDClick(options: INgxSelectOption[]) {
    if (options.length > 0) {

      if (this.products.value.length > 0) {

        //Check เมื่อเลือกแล้วมีการเปลื่อนแต่กด cancel
        if (this.supplierNameForm.value.SupplierName1 !== options[0].data.supplier_id) {
          const dialogRef = this.dialogService.open(AleartComponent, {
            context: {
              status: 'po',
            },
          });
          dialogRef.onClose.subscribe(result => {
            if (result === 'ok') {
              this.supplierID = options[0].data.supplier_id;
              this.supplierNameForm.get('SupplierName1').patchValue(options[0].data.supplier_id);
              this.arrProducts = [];
              this.products.clear();
              this.arrProducts = [];
              this.arrProductsName = [];
              this.arrProductsGroup = [];
              this.productsName = "";
              this.productsName1 = "";
              this.currencyTotal = "THB";
              this.arrSupplierList = null;
              this.arrSupplierList = options[0].data;
              this.isCheckSupplierList = "true";
              this.supplierAPIService.getSupID(options[0].data.supplier_id).subscribe(data => {
                this.arrSupplierLists = data.response_data;
                this.getProduct(this.arrSupplierLists[0].supplier_product_array)
              })
              this.getProductGroup();
              this.getSetting();
              this.editFrom();
            }
            this.clearName(this.supplierNameForm.value.SupplierName1);
          });
        }
      } else {
        this.supplierID = options[0].data.supplier_id;;
        this.supplierNameForm.get('SupplierName1').patchValue(options[0].data.supplier_id);
        this.arrProducts = [];
        this.products.clear();
        this.arrProducts = [];
        this.arrProductsName = [];
        this.arrProductsGroup = [];
        this.productsName = "";
        this.productsName1 = "";
        this.currencyTotal = "THB";
        this.arrSupplierList = null;
        this.arrSupplierList = options[0].data;
        this.isCheckSupplierList = "true";
        this.supplierAPIService.getSupID(options[0].data.supplier_id).subscribe(data => {
          this.arrSupplierLists = data.response_data;
          this.getProduct(this.arrSupplierLists[0].supplier_product_array)
        })
        this.getProductGroup();
        this.getSetting();
        this.editFrom();
      }
    } else {
      this.isCheckSupplierList = "false";
    }
  }

  editFrom() {
    this.supplierNameForm.patchValue({
      supplier_name: this.arrSupplierList.supplier_name,
      supplier_name_first: this.arrSupplierList.supplier_name_first,
      supplier_name_last: this.arrSupplierList.supplier_name_last,
      supplier_company_contact: this.arrSupplierList.supplier_company_contact,
      supplier_addr_phone: this.arrSupplierList.supplier_addr_phone,
      supplier_tel: this.arrSupplierList.supplier_tel,
      supplier_addr_full: this.arrSupplierList.supplier_addr_full,
      supplier_addr_number: this.arrSupplierList.supplier_addr_number,
      supplier_addr_tambon: this.arrSupplierList.supplier_addr_tambon,
      supplier_addr_amphoe: this.arrSupplierList.supplier_addr_amphoe,
      supplier_addr_province: this.arrSupplierList.supplier_addr_province,
      supplier_addr_postcode: this.arrSupplierList.supplier_addr_postcode,
    });
  }

  clearName(supplier_id) {
    this.supplierNameForm.get('supplierNameCtrl').patchValue(supplier_id);
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
          dataProduct.product_wholesale_array = data[index].product_wholesale_array;
          dataProduct.product_currency_code = data[index].product_currency_code;
          dataProduct.product_unit = data[index].product_unit;
          dataProduct.product_attribute = data[index].product_attribute;
          this.arrProductsName.push(dataProduct)
        }
      }
    }
  }

  btnClearAll() {
    this.productsForm.get("productsCtrl").patchValue("");
    this.products.clear();
    this.currencyTotal = "THB";
    this.arrProducts = this.arrProductsFilter;
  }

  getSetting() {
    const value = this.id_local;
    this.purchaseAPIService.getSettingDist(value).subscribe(data => {
      console.log(data.response_data);
      this.confirmForm.get('BillingAddress').patchValue(data.response_data[0].setting_data[0].billing_address);
      this.confirmForm.get('BillingName').patchValue(data.response_data[0].setting_data[0].billing_name);
    })

  }

  getProduct(data) {
    this.arrProducts = data;
    this.arrProductsFilter = data;
    console.log(this.arrProducts);
  }

  onChangeTab(event) {
    const e = event;
    this.productsName = "";
    this.productsName1 = "";
    this.strTab = e;
  }

  btnAddProduct(data: any) {
    console.log('data', data);

    const product = data;
    this.currencyTotal = product.product_currency_code;
    product.product_qty = 1;
    product.isCheckPlice = true;

    const wholesale_array = this.fb.array(data.product_wholesale_array)
    const group = this.fb.group({
      product_name: product.product_name,
      product_sku: product.product_sku,
      product_qty: product.product_qty,
      product_unit: product.product_unit,
      product_price: product.product_price,
      product_image_url: product.product_image_url,
      product_wholesale_array: wholesale_array,
      product_totalplice: product.product_price,
      supplier_product_id: product.supplier_product_id,
      product_currency_code: product.product_currency_code,
      product_attribute: product.product_attribute,
      isCheckPlice: product.isCheckPlice,
      numSales: product.product_price,

    });


    console.log("btnAddProduct : arrobjProduct : ", group);
    console.log("btnAddProduct : group : ", group);

    if (this.products.value.length === 0) {
      this.products.push(group)
      this.sumTotal();
      this.checkCurrency();
    } else {

      //filter หา id ที่ซ้ำ
      const groupID = this.products.value.filter((x) => x.supplier_product_id === group.value.supplier_product_id)
      console.log('groupID', groupID);
      if (groupID.length === 0) {
        this.products.push(group)
        this.sumTotal();
        this.checkCurrency();
      }
    }
    console.log('products', this.products);
  }


  checkCurrency() {
    //Check Currency
    if (this.products.value.length > 0) {
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
    console.log(searchValue, data);

    if (data.value.product_qty <= 0 || data.value.product_qty === "") {
      data.value.product_qty = 1;
      this.numQty = data.value.product_qty;
      this.clickQty(data.value);
      const dialogRef = this.dialogService.open(AleartComponent, {
        context: {
          status: 'Quantity',
        },
      });
      dialogRef.onClose.subscribe(result => {
        if (result === 'ok') {
          data.value.product_qty = 1;
          this.numQty = data.value.product_qty;
          this.clickQty(data.value);
        }
      });

    } else {
      this.numQty = data.value.product_qty;
      this.clickQty(data.value);

    }

    const array = this.productsForm.controls.products.value
    this.productsForm.controls.products.patchValue(array)
  }

  clickQty(value) {

    const productID = value.supplier_product_id;
    const dataminimum: any = [] = value.product_wholesale_array;
    console.log('dataminimum', dataminimum);
    console.log('numQty', this.numQty);

    if (this.products.value.length > 0) {
      for (let i = 0; i < this.products.value.length; i++) {
        if (this.products.value[i].supplier_product_id === productID) {

          this.products.value[i].isCheckPlice = true;
          this.products.value[i].numSales = this.products.value[i].product_price;

          if (dataminimum.length > 0) {
            //Check wholesale
            for (let index = 0; index < dataminimum.length; index++) {
              if (dataminimum[index].qty_minimum <= this.numQty) {
                const dataminimums = dataminimum[index]
                this.products.value[i].product_totalplice = (this.numQty * dataminimums.product_price)
                this.products.value[i].numSales = dataminimums.product_price;
                // tslint:disable-next-line: triple-equals
                if (this.products.value[i].product_price == dataminimums.product_price) {
                  this.products.value[i].isCheckPlice = true;
                } else {
                  this.products.value[i].isCheckPlice = false;
                }
              }
            }
          } else {
            this.products.value[i].product_totalplice = (this.numQty * this.products.value[i].product_price)
            this.products.value[i].numSales = this.products.value[i].product_price;
          }
        }
      }
    }

    this.sumTotal();
  }

  sumTotal() {
    console.log(this.products.value);

    this.sum = 0;
    this.products.value.forEach(x => this.sum += x.product_totalplice);
  }

  btnDeleteProduct(i) {
    this.sum = 0;
    const control = <FormArray>this.productsForm.controls['products'];
    control.removeAt(i);

    this.products.value.forEach(x => this.sum += x.product_totalplice);

    if (this.products.value.length === 0) {
      this.productsForm.get("productsCtrl").patchValue("");
      this.currencyTotal = "THB";
      this.arrProducts = this.arrProductsFilter;
    }

  }

  btnSaveClick() {
    this.isSaveLodding = true;
    this.save();
  }

  save() {

    const param_product_json = [];
    for (let index = 0; index < this.products.value.length; index++) {
      param_product_json.push({
        product_price: this.products.value[index].numSales,
        product_sku: this.products.value[index].product_sku,
        product_qty: this.products.value[index].product_qty,
        product_name: this.products.value[index].product_name,
      });
    }



    this.arrobjRow.distributor_id = this.id_local;
    this.arrobjRow.supplier_id = this.supplierID;
    this.arrobjRow.product_json = param_product_json;
    this.arrobjRow.billing_name = this.confirmForm.value.BillingName;
    this.arrobjRow.billing_address = this.confirmForm.value.BillingAddress;
    this.arrobjRow.delivery_location = this.arrSupplierLists[0].supplier_addr_full;
    this.arrobjRow.delivery_date = (new Date(this.confirmForm.value.DeliveryDate)).getTime() / 1000;
    this.arrobjRow.billing_payment_term = this.confirmForm.value.BillingTerm;
    this.arrobjRow.warehouse_id = this.confirmForm.value.WarehouseName;
    this.arrobjRow.note = this.confirmForm.value.Note;
    this.arrobjRow.sale_rep_id = 0;
    const dataJson = JSON.stringify(this.arrobjRow);
    console.log(' this.arrobjRow', this.arrobjRow);


    this.purchaseAPIService.addPurchase(dataJson).subscribe(data => {
      this.isSaveLodding = false;
      this.supplierNameForm.reset();
      this.router.navigate([this.UrlRouter_Purchase]);
    })

  }

  openImg(img: any) {
    this.dialogService.open(DialogsImageComponent, {
      context: {
        imgURL: img,
      },
    });
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

  btnRefresh() {
    this.productsName = "";
    this.productsName1 = "";
  }

  clickPayment(event) {
    console.log(event);
    this.confirmForm.get('BillingTerm').patchValue(event);
  }



}

