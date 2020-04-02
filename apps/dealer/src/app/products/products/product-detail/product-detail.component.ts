import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductAPIService } from '@project/services';
import { ProductData } from '@project/interfaces';
import { DialogsImageComponent } from '../../../dialogs/dialogs-image/dialogs-image.component';
import { NbDialogService } from '@nebular/theme';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WarehouseAPIService } from '@project/services';

@Component({
  selector: 'project-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductsDetailComponent implements OnInit {

  private UrlRouter_Products = "products/manager-products/order";
  private UrlRouter_ProductCreate = "products/products/create";
  arrProductDetail: any = [];
  arrProductDetails: any = [];
  RowID: string;
  supplier_name: string;
  product_category_name: string;
  loading = false;
  Form: FormGroup;
  arrWarehouse: any = [];
  active = 0;

  id_local: string;

  constructor(
    private warehouseAPIService: WarehouseAPIService,
    private router: Router,
    private productAPIService: ProductAPIService,
    private route: ActivatedRoute,
    private dialogService: NbDialogService,
    private formBuilder: FormBuilder,
  ) {
    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);
    this.loading = true;
  }

  ngOnInit() {

    this.buildForms();
    const params = this.route.snapshot.paramMap;
    if (params.has("id")) {
      this.RowID = params.get("id");

      if (this.RowID === "new") {
      } else {
        const parameters = 'product_id=' + this.RowID + '&dealer_id=' + this.id_local;
        this.productAPIService.getProductDetailDealer(parameters).subscribe(data => {
          console.log("ngOnInit : data : ", data);
          this.getWarehouse(res => {
            console.log("ngOnInit : res : ", res);
            res.forEach(item => {
              if (item.warehouse_id === data.response_data[0].warehouse_id) {
                data.response_data[0].warehouse_id = item.warehouse_name;
              }
            });

            this.arrProductDetail = data.response_data[0];
            console.log(this.arrProductDetail);

            this.getProductDetail(this.arrProductDetail);
            this.detailForm();
          });



        })

      }
    }

  }

  getProductDetail(data: any) {
    // this.arrProductDetails = data.product_warehouse_array;
    // if (data.product_category_array.length > 0) {
    //   this.product_category_name = data.product_category_array[0].product_category_name
    // } else {
    //   this.product_category_name = "";
    // }
    this.product_category_name = data.product_title;
    this.loading = false;
    // this.supplier_name = this.arrProductDetail.supplier_reference.supplier_name
  }


  buildForms() {
    this.Form = this.formBuilder.group({
      WarehouseName: [{ value: '', disabled: true }, Validators.required],
      catalogKeyword: [{ value: '', disabled: true }, Validators.required],
      product_name: [{ value: '', disabled: true }, Validators.required],
      product_sku: [{ value: '', disabled: true }, Validators.required],
      product_price: [{ value: '', disabled: true }, Validators.required],
      Quantity: [{ value: '', disabled: true }, Validators.required],
      productUnit: [{ value: '', disabled: true }, Validators.required],
      productNote: [{ value: '', disabled: true }, Validators.required]
    });
    this.loading = false;
  }

  detailForm() {
    console.log('detailForm : arrProductDetail : ', this.arrProductDetail);
    console.log('detailForm : arrProductDetail : ', this.arrProductDetail.product_title);
    this.active = this.arrProductDetail.product_is_active;
    console.log('detailForm : active : ', this.active);
    this.Form.patchValue({
      WarehouseName: this.arrProductDetail.warehouse_id,
      catalogKeyword: this.arrProductDetail.product_catalog_keyword,
      product_name: this.arrProductDetail.product_title,
      product_sku: this.arrProductDetail.product_sku,
      product_price: this.arrProductDetail.product_price,
      Quantity: this.arrProductDetail.checkin_data.onhand,
      productUnit: this.arrProductDetail.product_unit,
      productNote: this.arrProductDetail.note
    });
    this.loading = false;
  }


  toggle(_event_) {
    console.log("toggle : _event_ : ", _event_);
    if (this.active == 1) {
      _event_ = true;
    } else {
      _event_ = false;
    }
  }

  getWarehouse(callback: (res: any) => any) {
    const value = "distributor_id=" + 110 + "&warehouse_type_id=" + 2
    this.warehouseAPIService.getWarehouseList(value).subscribe(data => {
      const res = data.response_data;
      callback(res);
    })
  }

  btnCancelClick() {
    this.router.navigate([this.UrlRouter_Products]);
  }

  btnEditeClick() {
    this.router.navigate([this.UrlRouter_ProductCreate, this.arrProductDetail.product_id]);
  }


  openImg(img: any) {
    this.dialogService.open(DialogsImageComponent, {
      context: {
        imgURL: img,
      },
    });
  }


}
