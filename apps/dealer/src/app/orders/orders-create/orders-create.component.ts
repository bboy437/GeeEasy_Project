
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DealerAPIService, OrderAPIService, DistributorAPIService } from '@project/services';
import { WarehouseAPIService, ProductAPIService } from '@project/services';
import { DialogsImageComponent } from '../../dialogs/dialogs-image/dialogs-image.component';
import { NbDialogService } from '@nebular/theme';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { AleartComponent } from '../../dialogs/aleart/aleart.component';
import { DialogsCancelComponent } from '../../dialogs/dialogs-cancel/dialogs-cancel.component';
import { INgxSelectOption } from 'ngx-select-ex';

@Component({
  selector: 'project-orders-create',
  templateUrl: './orders-create.component.html',
  styleUrls: ['./orders-create.component.scss']
})
export class OrdersCreateComponent implements OnInit {

  public payment: string[] = ['1', '3', '7', '15', '30', '60', '90'];
  private UrlRouter_Order = "orders/list";
  supplierNameForm: FormGroup;
  productsForm: FormGroup;
  confirmForm: FormGroup;
  arrobjRow: any = {};
  arrDealer: any = [];
  arrProducts: any = [];
  arrProduct: any = [];
  arrobjRowProduct: any = [];
  arrDistributor: any = [];
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
  sum = 0;
  selectedValue: string;
  productsName: string;
  supplierName: string;
  strTab: string;
  DeliveryDate: string;
  BillingTerm: string;
  BillingName: string;
  BillingAddress: string;
  delivery_date = new Date()
  isCheckProduct: string;
  arrDealerName: any = [];
  distributor_id: string;

  id_local: string;


  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? this.arrProducts
        : this.arrProducts.filter(v => v.product_title.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
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


  public onFocus(e: Event): void {
    e.stopPropagation();
    setTimeout(() => {
      const inputEvent: Event = new Event('input');
      e.target.dispatchEvent(inputEvent);
    }, 0);
  }


  constructor(private fb: FormBuilder,
    private dealerAPIService: DealerAPIService,
    private orderAPIService: OrderAPIService,
    private warehouseAPIService: WarehouseAPIService,
    private router: Router,
    private route: ActivatedRoute,
    private productAPIService: ProductAPIService,
    private dialogService: NbDialogService,
    private distributorAPIService: DistributorAPIService) {

    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);
  }

  ngOnInit() {
    this.getDealer();
    this.getDistrbutor();
    this.getWarehouse();

    this.supplierNameForm = this.fb.group({
      dealerNameCtrl: ['', Validators.required],
    });
    this.productsForm = this.fb.group({
      productsCtrl: [null, Validators.required],

    });
    this.confirmForm = this.fb.group({
      DeliveryDate: ['', Validators.required],
      BillingTerm: ['', Validators.required],
      BillingName: ['', Validators.required],
      BillingAddress: ['', Validators.required],
      Note: ['', Validators.required],
    });
    this.confirmForm.get('DeliveryDate').patchValue(new Date());
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


  btnRefresh() {
    this.productsName = '';
  }


  getDistrbutor() {
    const value = "cur_page=" + 1 + "&per_page=" + 100;
    this.distributorAPIService.getDistList(value).subscribe(data => {
      this.arrDistributor = data.response_data;
      console.log(this.arrDistributor);

    })
  }

  getDealer() {
    const value = this.id_local;
    this.dealerAPIService.getDealerDetail(value).subscribe(data => {
      if (data.response_data.length > 0) {
        this.arrDealer = data.response_data;
        this.arrDealerName = this.arrDealer[0];
      }
      //2571677
      console.log(this.arrDealer);

    })
  }


  btnIDClick(options: INgxSelectOption[]) {
    if (options.length > 0) {
      console.log(options);
      this.distributor_id = options[0].data.distributor_id
      this.confirmForm.get('BillingName').patchValue(this.arrDealer[0].dealer_name);
      this.confirmForm.get('BillingAddress').patchValue(this.arrDealer[0].dealer_addr_full);

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
            this.getProduct();
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
    }
  }

  getProduct() {
    const value = "cur_page=" + 1 + "&per_page=" + 50 + "&distributor_id=" + this.distributor_id;
    this.productAPIService.getProductOrder(value).subscribe(data => {
      this.arrProducts = data.response_data;
      if (this.arrProducts !== undefined) {
        this.arrProducts.forEach(element => {
          element.product_price = element.product_price_array[0]
        });
      }
      console.log('product', this.arrProducts);

    })
  }


  getWarehouse() {
    const value = "distributor_id=" + 110 + "&warehouse_type_id=" + 2
    this.warehouseAPIService.getWarehouseList(value).subscribe(data => {
      this.arrWarehouse = data.response_data;
    })
  }

  onChangeTab(event) {
    const e = event;
    this.selectedValue = "";
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
          this.clickQty(data);
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
    if (this.arrobjRowProduct.length === 0) {
      this.isCheckProduct = ""
    }
  }


  btnSaveClick() {
    this.submitted = true;
    if (this.confirmForm.invalid) {
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

    this.arrobjRow.distributor_id = this.distributor_id;
    this.arrobjRow.supplier_id = 0;
    this.arrobjRow.dealer_id = this.id_local;
    this.arrobjRow.product_json = param_product_json;
    this.arrobjRow.billing_name = this.confirmForm.value.BillingName;
    this.arrobjRow.billing_address = this.confirmForm.value.BillingAddress;
    this.arrobjRow.delivery_location = this.arrDealerName.dealer_addr_full;
    this.arrobjRow.delivery_date = (new Date(this.confirmForm.value.DeliveryDate)).getTime() / 1000;
    this.arrobjRow.billing_payment_term = this.confirmForm.value.BillingTerm;
    this.arrobjRow.note = this.confirmForm.value.Note;
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


