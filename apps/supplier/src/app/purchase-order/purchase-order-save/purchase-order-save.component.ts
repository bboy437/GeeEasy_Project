import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  SupplierAPIService,
  PurchaseAPIService,
  ProductAPIService
} from "@project/services";
import { WarehouseAPIService } from "@project/services";
import { TypeaheadMatch } from "ngx-bootstrap";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DialogsImageComponent } from "../../dialogs/dialogs-image/dialogs-image.component";
import { NbDialogService } from "@nebular/theme";
import { DialogsCancelComponent } from "../../dialogs/dialogs-cancel/dialogs-cancel.component";
import { Observable, Subject, merge } from "rxjs";
import {
  debounceTime,
  map,
  distinctUntilChanged,
  filter
} from "rxjs/operators";
import { NgbTypeahead } from "@ng-bootstrap/ng-bootstrap";
import { AleartComponent } from "../../dialogs/aleart/aleart.component";

const payment = ["1", "3", "7", "15", "30", "60", "90"];

@Component({
  selector: "project-purchase-order-save",
  templateUrl: "./purchase-order-save.component.html",
  styleUrls: ["./purchase-order-save.component.scss"]
})
export class PurchaseOrderSaveComponent implements OnInit {
  private UrlRouter_Purchase = "purchases/list";
  arrobjRow: any = {};
  objAPIResponse: any = {};
  arrSupplier: any = [];
  arrProducts: any = [];
  arrProduct: any = [];
  arrobjRowProducts: any = [];
  arrobjRowProduct: any = [];
  arrWarehouse: any = [];
  arrSupplierLists: any = [];
  arrWholesale: any = [];
  arrProductsGroup: any = [];
  arrProductsName: any = [];
  RowID: string;
  delivery_date = new Date();
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
  maxDate: Date;

  value: string;

  @ViewChild("instance", { static: true }) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  search3 = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(
      debounceTime(200),
      distinctUntilChanged()
    );
    const clicksWithClosedPopup$ = this.click$.pipe(
      filter(() => !this.instance.isPopupOpen())
    );
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term =>
        (term === ""
          ? payment
          : payment.filter(
            v => v.toLowerCase().indexOf(term.toLowerCase()) > -1
          )
        ).slice(0, 10)
      )
    );
  };

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term =>
        term === ""
          ? this.arrProducts
          : this.arrProducts
            .filter(
              v =>
                v.product_name.toLowerCase().indexOf(term.toLowerCase()) >
                -1 ||
                v.product_sku.toLowerCase().indexOf(term.toLowerCase()) > -1
            )
            .slice(0, 10)
      )
    );
  search1 = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term =>
        term === ""
          ? this.arrProductsName
          : this.arrProductsName
            .filter(
              v =>
                v.product_name.toLowerCase().indexOf(term.toLowerCase()) >
                -1 ||
                v.product_sku.toLowerCase().indexOf(term.toLowerCase()) > -1
            )
            .slice(0, 10)
      )
    );
  formatter = x => {
    if (x === "") {
    } else {
      this.numQty = 1;
      this.btnAddProduct(x);
      this.selectedValue = "";
      this.clickQty(x);
    }
  };

  formatter1 = x1 => {
    if (x1 === "") {
    } else {
      // this.numQty = 1;
      this.btnAddProduct(x1);
      this.clickQty(x1);
      this.selectedValue1 = "";
    }
  };

  public onFocus(e: Event): void {
    e.stopPropagation();
    setTimeout(() => {
      const inputEvent: Event = new Event("input");
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
    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate.setMonth(this.minDate.getMonth() - 1);
    this.maxDate.setMonth(this.maxDate.getMonth() + 1);
    console.log(this.minDate);
    console.log("delivery_date", this.delivery_date);
  }

  ngOnInit() {
    this.getSupplier();
    this.getWarehouse();

    this.orderForm = this.fb.group({
      // qty: ['', Validators.required],
      BillingName: ["", Validators.required],
      BillingAddress: ["", Validators.required],
      deliveryDate: ["", Validators.required],
      BillingTerm: ["", Validators.required]
    });
  }

  get f() {
    return this.orderForm.controls;
  }

  getSupplier() {
    const value =
      "cur_page=" +
      1 +
      "&per_page=" +
      10 +
      "&search_text=" +
      "" +
      "&distributor_id=" +
      110 +
      "&product_category_id=" +
      0;
    this.supplierAPIService.getVerifiedSupplieList(value).subscribe(data => {
      this.arrSupplier = data.response_data;
    });
  }

  btnIDClick(id: string) {
    this.supplierID = id;

    if (this.arrobjRowProduct.length > 0) {
      const dialogRef = this.dialogService.open(AleartComponent, {
        context: {
          status: "po"
        }
      });
      dialogRef.onClose.subscribe(result => {
        if (result === "ok") {
          this.arrProducts = [];
          this.arrProductsName = [];
          this.arrProductsGroup = [];
          this.arrobjRowProduct = [];
          this.selectedValue = "";
          this.selectedValue1 = "";
          this.strProductGroup = "";
          this.strTab = "Product Name";
        }
      });
    } else {
      this.arrProducts = [];
      this.arrProductsName = [];
      this.arrProductsGroup = [];
      this.arrobjRowProduct = [];
      this.selectedValue = "";
      this.selectedValue1 = "";
      this.strProductGroup = "";
      this.strTab = "Product Name";
      this.supplierAPIService.getSupID(id).subscribe(data => {
        this.arrSupplierLists = data.response_data;
        this.getProduct(this.arrSupplierLists[0].supplier_product_array);
      });
      this.getProductGroup();
      this.getSetting();
    }
  }

  getProduct(data) {
    this.arrProducts = data;
  }

  getProductGroup() {
    const value =
      "cur_page=" + 1 + "&per_page=" + 10 + "&distributor_id=" + 110;
    this.productAPIService.getProductGroup(value).subscribe(data => {
      this.arrProductsGroup = data.response_data;
    });
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
          dataProduct.product_wholesale_array = [
            {
              product_price: data[index].product_price,
              qty_minimum: 1
            }
          ];

          this.arrProductsName.push(dataProduct);
          console.log(this.arrProductsName);
        }
      }
    }
  }

  getSetting() {
    const value = "110";
    this.purchaseAPIService.getSettingDist(value).subscribe(data => {
      console.log(data.response_data);

      this.arrobjRow.billing_address =
        data.response_data[0].setting_data[0].billing_address;
      this.arrobjRow.billing_name =
        data.response_data[0].setting_data[0].billing_name;
      this.arrobjRow.billing_payment_term =
        data.response_data[0].setting_data[0].billing_payment_term;
    });
  }

  getWarehouse() {
    const value = "distributor_id=" + 110 + "&warehouse_type_id=" + 2;
    this.warehouseAPIService.getWarehouseList(value).subscribe(data => {
      this.arrWarehouse = data.response_data;
    });
  }

  onChangeTab(event) {
    const e = event;
    this.selectedValue = "";
    this.selectedValue1 = "";
    this.strTab = e;
  }

  btnAddProduct(data: any) {
    console.log("data", data);

    const product = data;
    const arrobjProduct: any = {};
    arrobjProduct.product_name = product.product_name;
    arrobjProduct.product_sku = product.product_sku;
    arrobjProduct.product_qty = 1;
    arrobjProduct.product_price = product.product_price;
    arrobjProduct.product_image_url = product.product_image_url;
    arrobjProduct.product_wholesale_array = product.product_wholesale_array;
    arrobjProduct.product_totalplice = product.product_price;
    arrobjProduct.supplier_product_id = product.supplier_product_id;
    if (this.arrobjRowProduct.length === 0) {
      this.arrobjRowProduct.push(arrobjProduct);
      this.sumTotal();
    } else {
      this.arrobjRowProduct.push(arrobjProduct);
      if (this.arrobjRowProduct) {
        const array = this.arrobjRowProduct;
        const arrayNew = new Map(
          array.map(obj => [obj.supplier_product_id, obj])
        );
        const arrayNews = Array.from(arrayNew.values());
        this.arrobjRowProduct = arrayNews;
        this.sumTotal();
      }
    }
  }

  btnSelectWholesale(data: any) {
    this.arrWholesale = data;
  }

  onSearchChange(searchValue, data: any): void {
    const value = searchValue;
    if (value === "0" || value === "") {
      const dialogRef = this.dialogService.open(AleartComponent, {
        context: {
          status: "Quantity"
        }
      });
      dialogRef.onClose.subscribe(result => {
        if (result === "ok") {
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

  clickQty(value) {
    
    
    const productID = value.supplier_product_id;
    const dataminimum: any = ([] = value.product_wholesale_array);
    if (this.arrobjRowProduct.length > 0) {
      for (let i = 0; i < this.arrobjRowProduct.length; i++) {
        if (this.arrobjRowProduct[i].supplier_product_id === productID) {
          if (dataminimum.length > 0) {
            for (let index = 0; index < dataminimum.length; index++) {
              if (dataminimum[index].qty_minimum <= this.numQty) {
                const dataminimums = dataminimum[index];
                console.log("clickQty : numQty : ",this.numQty);
                this.arrobjRowProduct[i].product_totalplice =
                this.numQty * dataminimums.product_price;
                this.arrobjRowProduct[i].numSales = dataminimums.product_price;
                // tslint:disable-next-line: triple-equals
                if (
                  this.arrobjRowProduct[i].product_price ==
                  dataminimums.product_price
                ) {
                  this.arrobjRowProduct[i].isCheckPlice = true;
                } else {
                  this.arrobjRowProduct[i].isCheckPlice = false;
                }
              }
            }
          } else {
            this.arrobjRowProduct[i].product_totalplice =
              this.numQty * this.arrobjRowProduct[i].product_price;
            this.arrobjRowProduct[i].numSales = this.arrobjRowProduct[
              i
            ].product_price;
          }
        }
      }
    }
    this.sumTotal();
  }

  sumTotal() {
    this.sum = 0;
    this.arrobjRowProduct.forEach(x => (this.sum += x.product_totalplice));
  }

  btnDeleteProduct(i) {
    this.sum = 0;
    this.arrobjRowProduct.splice(i, 1);
    this.arrobjRowProduct.forEach(x => (this.sum += x.product_totalplice));
  }

  btnClear() {
    this.arrobjRow = [];
    this.arrobjRowProduct = [];
    this.supplierName = "";
    this.selectedValue = "";
    this.strProductGroup = "";
    this.strProductName = "";
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
    if ((this.supplierName === '' || this.supplierName === undefined) || (this.arrobjRow.warehouse_id === '' || this.arrobjRow.warehouse_id === undefined)) {
      return;
    }
    this.save();
  }

  save() {
    console.log("yes");

    // console.log(this.arrobjRowProduct);
    // const param_product_json = JSON.stringify(this.arrobjRowProduct);
    const param_product_json = [];
    for (let index = 0; index < this.arrobjRowProduct.length; index++) {
      param_product_json.push({
        product_price: this.arrobjRowProduct[index].numSales,
        product_sku: this.arrobjRowProduct[index].product_sku,
        product_qty: this.arrobjRowProduct[index].product_qty,
        product_name: this.arrobjRowProduct[index].product_name
      });
    }

    this.arrobjRow.distributor_id = 110;
    this.arrobjRow.supplier_id = 13356;
    this.arrobjRow.product_json = param_product_json;
    this.arrobjRow.delivery_location = this.arrSupplierLists[0].supplier_addr_full;
    this.arrobjRow.delivery_date =
      new Date(this.delivery_date).getTime() / 1000;
    this.arrobjRow.warehouse_id = 0;
    this.arrobjRow.sale_rep_id = 0;
    const dataJson = JSON.stringify(this.arrobjRow);

    this.purchaseAPIService.addPurchase(dataJson).subscribe(data => {
      this.router.navigate([this.UrlRouter_Purchase]);
    });
    // this.saveSetting()
  }

  saveSetting() {
    const dataJson = {
      distributor_id: 110,
      setting_json: [
        {
          billing_payment_term: this.arrobjRow.billing_payment_term,
          billing_name: this.arrobjRow.billing_name,
          billing_address: this.arrobjRow.billing_address,
          warehouse_id: this.arrobjRow.warehouse_id
        }
      ]
    };
    console.log("dataJson", dataJson);

    this.purchaseAPIService
      .addSettingDist(JSON.stringify(dataJson))
      .subscribe(data => {
        this.router.navigate([this.UrlRouter_Purchase]);
      });
  }

  btnCancel() {
    const dialogRef = this.dialogService.open(DialogsCancelComponent, {});

    dialogRef.onClose.subscribe(result => {
      if (result === "cancel") {
      }
      if (result === "ok") {
        this.router.navigate([this.UrlRouter_Purchase]);
      }
    });
  }

  openImg(img: any) {
    this.dialogService.open(DialogsImageComponent, {
      context: {
        imgURL: img
      }
    });
  }

  updateMyDate(newDate) {
    console.log(newDate);
  }

  createSupplier() {
    // const dialogRef = this.dialogService.open(SupplierCreateComponent, {});

    // dialogRef.onClose.subscribe(result => {
    //   if (result === "ok") {
    //     this.getSupplier();
    //   }
    // });
  }

  alert() {
    const dialogRef = this.dialogService.open(AleartComponent, {});

    dialogRef.onClose.subscribe(result => {
      if (result === "ok") {
        // this.getSupplier();
      }
    });
  }
}
