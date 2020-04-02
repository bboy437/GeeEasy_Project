import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SupplierAPIService, PurchaseAPIService } from '@project/services';
import { WarehouseAPIService, ProductAPIService } from '@project/services';
import { TypeaheadMatch } from 'ngx-bootstrap';
import { DialogsImageComponent } from '../../dialogs/dialogs-image/dialogs-image.component';
import { NbDialogService } from '@nebular/theme';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { AleartComponent } from '../../dialogs/aleart/aleart.component';

@Component({
  selector: 'project-purchase-order-create',
  templateUrl: './purchase-order-create.component.html',
  styleUrls: ['./purchase-order-create.component.scss']
})
export class PurchaseOrderCreateComponent implements OnInit {

  private UrlRouter_Purchase = "purchases/list";
  supplierNameForm: FormGroup;
  productsForm: FormGroup;
  confirmForm: FormGroup;
  arrobjRow: any = {};
  arrSupplier: any = [];
  arrSupplierList: any = [];
  arrProducts: any = [];
  arrProduct: any = [];
  arrobjRowProduct: any = [];
  arrSupplierLists: any = [];
  arrWarehouse: any = [];
  submitted = false;
  arrWholesale: any = [];
  arrProductsGroup: any = [];
  arrProductsName: any = [];
  strProductGroup: string;
  strProductName: string;
  supplierID: string;
  name: number;
  numQty = 1;
  isCheckSupplierList: string;
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
  isCheckProduct: string;
  


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
      this.isCheckProduct = "yes";
    }
  }

  formatter1 = (x1) => {
    if (x1 === '') { }
    else {
      this.numQty = 1;
      this.btnAddProduct(x1);
      this.clickQty(x1);
      this.productsName1 = "";
      this.isCheckProduct = "yes";
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
    private dialogService: NbDialogService, ) {
  }

  ngOnInit() {
    this.getSupplier();
    this.getWarehouse();
    this.supplierNameForm = this.fb.group({
      supplierNameCtrl: ['', Validators.required],
    });
    this.productsForm = this.fb.group({
      productsCtrl: [null, Validators.required],

    });
    this.confirmForm = this.fb.group({
      DeliveryDate: ['', Validators.required],
      BillingTerm: ['', Validators.required],
      BillingName: ['', Validators.required],
      BillingAddress: ['', Validators.required],
    });
  }

  get f() { return this.supplierNameForm.controls; }
  get p() { return this.productsForm.controls; }
  get c() { return this.confirmForm.controls; }

  onSupplierNameSubmit() {
    this.submitted = true;
    if (this.supplierNameForm.invalid) {
      return;
    }
  }

  btnClickSupplierName() {
    this.submitted = true;
    if (this.supplierNameForm.invalid) {
      return;
    } else {
      this.supplierNameForm.markAsDirty();
    }

  }

  onProductsSubmit() {
    this.submitted = true;
    if (this.productsForm.invalid) {
      return;
    }
    if (this.arrobjRowProduct.length === 0) {
      return;
    }
  }

  btnClickProduct() {
  }


  btnClickonConfirmSubmit() {
    this.submitted = true;
    if (this.confirmForm.invalid) {
      return;
    }
    this.btnSaveClick();
    this.confirmForm.markAsDirty();
  }

  onConfirmSubmit() {
    this.confirmForm.markAsDirty();
  }


  getSupplier() {
    const value = "cur_page=" + 1 + "&per_page=" + 10 + "&search_text=" + "" + "&distributor_id=" + 110 + "&product_category_id=" + 0;
    this.supplierAPIService.getVerifiedSupplieList(value).subscribe(data => {
      this.arrSupplier = data.response_data;
      console.log('arrSupplier', this.arrSupplier);
    })
  }

  getWarehouse() {
    const value = "distributor_id=" + 110 + "&warehouse_type_id=" + 2
    this.warehouseAPIService.getWarehouseList(value).subscribe(data => {
      this.arrWarehouse = data.response_data;
    })
  }

  btnIDClick(id: string, sup: any) {

    this.supplierID = id;

    if (this.arrobjRowProduct.length > 0) {
      const dialogRef = this.dialogService.open(AleartComponent, {
         context: {
          status: 'po',
        },
      });
      dialogRef.onClose.subscribe(result => {
        if (result === 'ok') {
          this.arrProducts = [];
          this.arrobjRowProduct = [];
          this.arrProducts = [];
          this.arrProductsName = [];
          this.arrProductsGroup = [];
          this.productsName = "";
          this.productsName1 = "";
          this.arrSupplierList = null;
          this.arrSupplierList = sup;
          this.isCheckSupplierList = "true";
        }
      });
    } else {
      this.supplierID = id;
      this.arrProducts = [];
      this.arrobjRowProduct = [];
      this.arrProducts = [];
      this.arrProductsName = [];
      this.arrProductsGroup = [];
      this.productsName = "";
      this.productsName1 = "";
      this.arrSupplierList = null;
      this.arrSupplierList = sup;
      this.isCheckSupplierList = "true";
      this.supplierAPIService.getSupID(id).subscribe(data => {
        this.arrSupplierLists = data.response_data;
        this.getProduct(this.arrSupplierLists[0].supplier_product_array)
      })
      this.getProductGroup();
      this.getSetting();
    }

  }

  getProductGroup() {
    const value = "cur_page=" + 1 + "&per_page=" + 10 + "&distributor_id=" + 110;
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
    const value = "110";
    this.purchaseAPIService.getSettingDist(value).subscribe(data => {
      console.log(data.response_data);
      this.arrobjRow.billing_address = data.response_data[0].setting_data[0].billing_address;
      this.arrobjRow.billing_name = data.response_data[0].setting_data[0].billing_name;
      this.arrobjRow.billing_payment_term = data.response_data[0].setting_data[0].billing_payment_term;
    })

  }


  getProduct(data) {
    this.arrProducts = data;
    console.log(this.arrProducts);
  }

  onChangeTab(event) {
    const e = event;
    this.productsName = "";
    this.productsName1 = "";
    this.strTab = e;
  }



  btnAddProduct(data: any) {
    const product = data;
    if (this.arrobjRowProduct.length === 0) {
      const arrobjProduct: any = {};
      arrobjProduct.product_name = product.product_name;
      arrobjProduct.product_sku = product.product_sku;
      arrobjProduct.product_qty = 1;
      arrobjProduct.product_price = product.product_price;
      arrobjProduct.product_image_url = product.product_image_url;
      arrobjProduct.product_wholesale_array = product.product_wholesale_array;
      arrobjProduct.product_totalplice = product.product_price;
      arrobjProduct.supplier_product_id = product.supplier_product_id;
      this.arrobjRowProduct.push(arrobjProduct);
      this.sumTotal();
    } else {
      for (let x = 0; x < this.arrobjRowProduct.length; x++) {
        if (this.arrobjRowProduct[x].supplier_product_id !== product.supplier_product_id) {
          const arrobjProduct: any = {};
          arrobjProduct.product_name = product.product_name;
          arrobjProduct.product_sku = product.product_sku;
          arrobjProduct.product_qty = 1;
          arrobjProduct.product_price = product.product_price;
          arrobjProduct.product_image_url = product.product_image_url;
          arrobjProduct.product_wholesale_array = product.product_wholesale_array;
          arrobjProduct.product_totalplice = product.product_price;
          arrobjProduct.supplier_product_id = product.supplier_product_id;
          this.arrobjRowProduct.push(arrobjProduct);
        }
      }
      const array = this.arrobjRowProduct
      console.log('array', array);
      const arrayNew = new Map(array.map(obj => [obj.supplier_product_id, obj]));
      const arrayNews = Array.from(arrayNew.values());
      console.log('arrayNews', arrayNews);

      this.arrobjRowProduct = arrayNews;
      this.sumTotal();
    }

  }



  btnSelectWholesale(data: any) {
    this.arrWholesale = data;
  }

  onSearchChange(searchValue, data: any): void {

    // tslint:disable-next-line: triple-equals
    if (searchValue == 0 || searchValue == "" || searchValue == null || searchValue == 'null') {
      const dialogRef = this.dialogService.open(AleartComponent, {
        context: {
          status: 'Quantity',
        },
      });
      dialogRef.onClose.subscribe(result => {
        if (result === 'ok') {
          data.product_qty = 1;
        }
      });
    } else {
      this.numQty = searchValue;
      this.clickQty(data);
    }
  }



  clickQty(value) {
    const productID = value.supplier_product_id;
    const dataminimum: any = [] = value.product_wholesale_array;
    if (this.arrobjRowProduct.length > 0) {
      for (let i = 0; i < this.arrobjRowProduct.length; i++) {
        if (this.arrobjRowProduct[i].supplier_product_id === productID) {
          if (dataminimum.length > 0) {
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
    if(this.arrobjRowProduct.length === 0){
      this.isCheckProduct = ""
    }
  }



  btnSaveClick() {

    this.save();
  }

  save() {
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

    this.arrobjRow.distributor_id = 110;
    this.arrobjRow.supplier_id = this.arrSupplierList.supplier_id;
    this.arrobjRow.product_json = param_product_json;
    this.arrobjRow.delivery_location = this.arrSupplierLists[0].supplier_addr_full;
    this.arrobjRow.delivery_date = (new Date(this.delivery_date)).getTime() / 1000;
    this.arrobjRow.warehouse_id = 0;
    this.arrobjRow.sale_rep_id = 0;
    const dataJson = JSON.stringify(this.arrobjRow);
    console.log(' this.arrobjRow', this.arrobjRow);


    this.purchaseAPIService.addPurchase(dataJson).subscribe(data => {
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
    // const dialogRef = this.dialogService.open(SupplierCreateComponent, {
    // });

    // dialogRef.onClose.subscribe(result => {
    //   if (result === 'ok') {
    //     this.getSupplier();
    //   }
    // });
  }


}

