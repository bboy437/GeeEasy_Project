import { Component, OnInit } from '@angular/core';
import { TeamAPIService, ProductAPIService, SellerService } from '@project/services';
import { Router, ActivatedRoute } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AleartComponent } from '../../../dialogs/aleart/aleart.component';
import { DialogsCancelComponent } from '../../../dialogs/dialogs-cancel/dialogs-cancel.component';
import { log } from 'util';

@Component({
  selector: 'project-add-product-seller',
  templateUrl: './add-product-seller.component.html',
  styleUrls: ['./add-product-seller.component.scss']
})
export class AddProductSellerComponent implements OnInit {
  private UrlRouter_Detail = "team/myteam/detail";
  FromProduct: FormGroup;
  group_id: string;
  user_id: string;
  user_name: string;
  status: string;
  submitted = false;
  arrobjRow: any = {};
  arrobjSeller: any = [];
  filter: any = [];
  arrUser: any = [];
  arrProducts: any = [];
  arrProductsFilter: any = [];
  products: any = [];
  arrWholesale = [];
  checkin_data: any = {};
  loading = false;

  id_local: string;

  constructor(
    private teamAPIService: TeamAPIService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: NbDialogService,
    private formBuilder: FormBuilder,
    private productAPIService: ProductAPIService,
    private sellerService: SellerService
  ) {
    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);
    this.loading = true;

  }

  ngOnInit() {
    this.buildFormProduct();
    const params = this.route.snapshot.paramMap;
    this.group_id = params.get("group_id");
    this.user_id = params.get("user_id");
    this.user_name = params.get("user_name");
    this.status = params.get("status");

    this.getDataSeller();
    this.getData();
  }

  buildFormProduct() {
    this.FromProduct = this.formBuilder.group({
      seller_id: []
    });
  }

  getDataSeller() {
    this.sellerService.getSellerProduct(this.user_id).subscribe(res => {
      this.products = res.response_data;
      if (this.products.length > 0) {
        this.products.forEach(element => {
          element.product_wholesale_array.forEach(wholesale => {
            element.product_qty = 1;
            element.product_price = wholesale.product_price;
            wholesale.unit_price = wholesale.unit_prices;

          });
        });
        this.loading = false;
      }

      console.log('products', this.products);

    })
  }

  getData() {
    this.teamAPIService.getTeamDetail(this.group_id).subscribe(res => {
      this.arrobjRow = res.response_data[0];

      this.arrProductsFilter = res.response_data[0].group_product_array;
      this.arrProducts = res.response_data[0].group_product_array;
      this.arrProducts.forEach(element => {
        element.product_name = element.product_title.concat(" (", element.product_sku, ")")
      });
      const array = this.arrProducts;
      const arrayNew = new Map(array.map(obj => [obj.product_id, obj]));
      const arrayNews = Array.from(arrayNew.values());
      this.arrProducts = arrayNews;
      this.loading = false;
      console.log('arrProducts', this.arrProducts);
      console.log('arrProductsFilter', this.arrProductsFilter);
      console.log('arrobjRow', this.arrobjRow);
    })
  }

  productSellerChange(event) {

    let dataProduct = [];
    dataProduct = this.arrProductsFilter.filter((x) => x.product_id === event[0].data.product_id)
    console.log(event[0].data);
    console.log('this.arrProductsFilter', this.arrProductsFilter);
    console.log('dataProduct', dataProduct);

    if (event.length > 0) {
      for (let index = 0; index < dataProduct.length; index++) {
        this.products.push({
          product_id: dataProduct[index].product_id,
          product_title: dataProduct[index].product_title,
          product_sku: dataProduct[index].product_sku,
          product_price: dataProduct[index].product_price,
          product_qty: 1,
          product_image_url: dataProduct[index].product_image_url,
          onhand: dataProduct[index].checkin_data.onhand,
          checkin_data: dataProduct[index].checkin_data,
          product_wholesale_array: [{
            qty_minimum: 1,
            unit_price: dataProduct[index].product_price,
            discount_thb: 0,
            discount_percent: 0,
            sales_price: dataProduct[index].product_price,
            thb: true,
            percent: false,
            status: 'THB',
          }],
          product_data_ref: {
            ref_1: '0',
            ref_2: '0',
            ref_3: '0',
          }

        })
      }

      console.log('this.products', this.products);
    }
  }

  onKeyQTY(searchValue, data: any): void {
    console.log(data);
    if (data.product_qty <= 0 || data.product_qty > data.onhand || data.product_qty === "") {
      const dialogRef = this.dialogService.open(AleartComponent, {
        context: {
          status: 'Quantity',
        },
      });
      dialogRef.onClose.subscribe(result => {
        if (result === 'ok') {
          data.product_qty = 1;
          data.checkin_data.onhand = data.product_qty;
        }
      });

    } else {
      data.checkin_data.onhand = data.product_qty;
    }
  }

  onKeyMinimum(searchValue, data: any): void {
    console.log(data);
    if (data.qty_minimum <= 0 || data.qty_minimum === "") {
      const dialogRef = this.dialogService.open(AleartComponent, {
        context: {
          status: 'Quantity',
        },
      });
      dialogRef.onClose.subscribe(result => {
        if (result === 'ok') {
          data.qty_minimum = 1;
        }
      });

    }
  }

  onKeyPrice(searchValue, data: any): void {
    console.log(data);
    console.log('this.products', this.products);

    if (data.unit_price < 0 || data.unit_price === "") {
      const dialogRef = this.dialogService.open(AleartComponent, {
        context: {
          status: 'Quantity',
        },
      });
      dialogRef.onClose.subscribe(result => {
        if (result === 'ok') {
          data.thb === true ? data.discount_thb = 0 : data.discount_percent = 0;
          data.sales_price = (data.unit_price - Number(data.thb === true ? data.discount_thb : data.discount_percent));
        }
      });

    } else {
      data.sales_price = (data.unit_price - Number(data.thb === true ? data.discount_thb : data.discount_percent));
    }
  }

  onKeyDiscountTHB(searchValue, data: any): void {
    console.log(data);
    console.log('this.products', this.products);

    data.discount_percent = 0;
    if (data.discount_thb < 0 || data.discount_thb === "") {
      const dialogRef = this.dialogService.open(AleartComponent, {
        context: {
          status: 'Quantity',
        },
      });
      dialogRef.onClose.subscribe(result => {
        if (result === 'ok') {
          data.discount_thb = 0;
          data.sales_price = (Number(data.unit_price) - Number(data.discount_thb));
        }
      });

    } else {
      data.sales_price = (Number(data.unit_price) - Number(data.discount_thb));
    }
  }



  onKeyDiscountPercent(searchValue, data: any): void {
    console.log(data);
    data.discount_thb = 0;

    if (data.discount_percent < 0 || data.discount_percent === "") {
      const dialogRef = this.dialogService.open(AleartComponent, {
        context: {
          status: 'Quantity',
        },
      });
      dialogRef.onClose.subscribe(result => {
        if (result === 'ok') {
          data.discount_percent = 0;
          data.sales_price = (Number(data.unit_price) - (Number(data.unit_price) * Number(data.discount_percent / 100)));
        }
      });

    } else {
      data.sales_price = (Number(data.unit_price) - (Number(data.unit_price) * Number(data.discount_percent / 100)));
    }
  }

  deleteWholesale(data, i) {
    data.splice(i, 1);
    console.log(data);
  }


  toggle(checked: boolean, data: any, status) {
    console.log(checked, data, status);
    if (status === 'THB') {
      data.percent = false;
      data.discount_thb = data.discount_percent;
      data.sales_price = (Number(data.unit_price) - Number(data.discount_thb));

      if (data.discount_thb !== 0) {
        data.discount_percent = 0;

      }
    } else {
      data.thb = false;
      data.discount_percent = data.discount_thb;
      data.sales_price = (Number(data.unit_price) - (Number(data.unit_price) * Number(data.discount_percent / 100)));
      if (data.discount_percent !== 0) {
        data.discount_thb = 0;
      }
    }
  }


  addWholesale(product, i) {

    const data: any = {};
    data.qty_minimum = 1;
    data.unit_price = Number(product.product_price);
    data.sales_price = Number(product.product_price);
    data.discount_thb = 0;
    data.discount_percent = 0;
    data.thb = true;
    data.percent = false;
    data.status = 'THB';

    product.product_wholesale_array.push(data);
    console.log(product, i);
    console.log('this.products', this.products);
  }


  btnDeleteProduct(i) {
    this.products.splice(i, 1);

  }

  btnSaveClick() {
    this.save();
  }


  save() {
    this.loading = true;
    for (let i = 0; i < this.products.length; i++) {
      for (let iw = 0; iw < this.products[i].product_wholesale_array.length; iw++) {
        delete this.products[i].product_totalplice;
        delete this.products[i].product_qty;
        delete this.products[i].onhand;
        delete this.products[i].user_id;
        delete this.products[i].dealer_id;
        // delete this.products[i].create_time;
        // delete this.products[i].user_product_id;
        delete this.products[i].group_id;
        this.products[i].create_time = 0;
        this.products[i].user_product_id = 0;
        this.products[i].product_wholesale_array[iw].unit_prices = Number(this.products[i].product_wholesale_array[iw].unit_price);
        this.products[i].product_wholesale_array[iw].product_price = Number(this.products[i].product_price);
        this.products[i].product_wholesale_array[iw].sales_price = Number(this.products[i].product_wholesale_array[iw].sales_price);
        delete this.products[i].product_wholesale_array[iw].unit_price
      }
      // Unit Price
    }

    console.log(this.products);

    const dataJson = {
      group_id: this.group_id,
      user_id: this.user_id,
      dealer_id: this.id_local,
      product_json: this.products,

    }

    console.log(dataJson);

    this.sellerService.postProductCreate(JSON.stringify(dataJson)).subscribe(data => {
      console.log(data);
      this.loading = false;
      this.router.navigate([this.UrlRouter_Detail, this.group_id, this.status]);
    })

  }

  btnCancelClick() {
    const dialogRef = this.dialogService.open(DialogsCancelComponent, {
    });

    dialogRef.onClose.subscribe(result => {
      if (result === 'cancel') {
      }
      if (result === 'ok') {
        this.router.navigate([this.UrlRouter_Detail, this.group_id, this.status]);
      }
    });
  }

  btnBackClick() {
    this.router.navigate([this.UrlRouter_Detail, this.group_id, this.status]);
  }

}
