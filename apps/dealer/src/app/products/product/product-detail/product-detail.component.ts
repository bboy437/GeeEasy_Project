import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductAPIService, UploadAPIService } from '@project/services';
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

  image = {
    update: false,
    main_image: {
      get: [],
      port: []
    }
  }


  constructor(
    private warehouseAPIService: WarehouseAPIService,
    private router: Router,
    private productAPIService: ProductAPIService,
    private route: ActivatedRoute,
    private dialogService: NbDialogService,
    private formBuilder: FormBuilder,
    private uploadAPIService: UploadAPIService
  ) {
    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);
    this.loading = true;
  }

  ngOnInit() {

    this.buildForms();
    const params = this.route.snapshot.paramMap;
    this.RowID = params.get("id");

    if (this.RowID) {
      const parameters = 'product_id=' + this.RowID + '&dealer_id=' + this.id_local;
      this.productAPIService.getProductDetailDealer(parameters).subscribe(res => {
        this.productAPIService.dataProductDetailDealer(res)
        this.getData(res);
      })
    }

  }

  getData(data) {

    this.getWarehouse(res => {
      res.forEach(item => {
        if (item.warehouse_id === data.response_data[0].warehouse_id) {
          data.response_data[0].warehouse_name = item.warehouse_name;
        }
      });

      this.arrProductDetail = data.response_data[0];
      console.log(this.arrProductDetail);

      if (
        this.arrProductDetail.product_image_url !== undefined &&
        this.arrProductDetail.product_image_url !== "-" &&
        this.arrProductDetail.product_image_url !== ""
      )
        this.uploadAPIService
          .uploadImage()
          .getUrl(this.arrProductDetail.product_image_url, red_image => {
            this.image.main_image.get.push(red_image);
          });

      this.getProductDetail(this.arrProductDetail);
      this.detailForm();
    });

  }

  getProductDetail(data: any) {
    this.product_category_name = data.product_title;
    this.loading = false;
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
    this.active = this.arrProductDetail.product_is_active;
    this.Form.patchValue({
      WarehouseName: this.arrProductDetail.warehouse_name,
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
    this.warehouseAPIService.warehouseDealerList$.subscribe(data => {
      const res = data;
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
