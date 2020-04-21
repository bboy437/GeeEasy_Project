import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductAPIService, UploadAPIService } from '@project/services';
import { ProductData } from '@project/interfaces';
import { DialogsImageComponent } from '../../../dialogs/dialogs-image/dialogs-image.component';
import { NbDialogService } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";

@Component({
  selector: 'project-my-product-detail',
  templateUrl: './manage-product-detail.component.html',
  styleUrls: ['./manage-product-detail.component.scss']
})
export class MyProductDetailComponent implements OnInit {

  private UrlRouter_Products = "products/manage/list";
  private UrlRouter_ProductsGroup = "products/group/list";
  private UrlRouter_ProductsStock = "products/stock/list";
  arrProductDetail: any = [];
  arrProductDetails: any = [];
  arrProducts: any = [];
  RowID: string;
  supplier_name: string;
  status: string;
  loading = false;
  checkedAll: boolean;
  productForm: FormGroup;

  id_local: string;

  image = {
    update: false,
    main_image: {
      get: [],
      port: []
    }
  }

  constructor(
    private router: Router,
    private productAPIService: ProductAPIService,
    private route: ActivatedRoute,
    private dialogService: NbDialogService,
    private uploadAPIService: UploadAPIService,
    private formBuilder: FormBuilder,
  ) {
    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);
    this.loading = true;
  }

  ngOnInit() {
    this.buildForm();
    const params = this.route.snapshot.paramMap;
    this.status = this.route.snapshot.queryParamMap.get('status')
    if (params.has("id")) {
      this.RowID = params.get("id");
      if (this.RowID === "new") {
      } else {

        this.productAPIService.productDistributor$.subscribe(res => {
          this.arrProducts = res;

          if (this.arrProducts.length > 0) {
            for (let i = 0; i < this.arrProducts.length; i++) {
              // tslint:disable-next-line: triple-equals
              if (this.arrProducts[i].product_id == this.RowID) {
                this.getDetail(this.arrProducts[i].product_row_key)
              }
            }
          }
        })
      }
    }

  }

  getDetail(value) {
    const values =
      "distributor_id=" + value.distributor_id +
      "&supplier_id=" + value.supplier_id +
      "&product_id=" + value.product_id +
      "&product_sku=" + value.product_sku +
      "&product_price=" + value.product_price
    this.productAPIService.getViewDefaultID(values).subscribe(data => {
      this.arrProductDetail = data.response_data[0];
      this.arrProductDetails = this.arrProductDetail.product_row_display_array;
      console.log(this.arrProductDetail);
      console.log(this.arrProductDetails);

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

      this.allProductIsActive(this.arrProductDetails, res => {
        this.checkedAll = res;
      });
      this.editForm();
    })
  }

  buildForm() {
    this.productForm = this.formBuilder.group({
      product_title: [{ value: "", disabled: true }, , Validators.required],
      product_sku: [{ value: "", disabled: true }, , Validators.required],
      product_price: [{ value: "", disabled: true }, , Validators.required],
      note: [{ value: "", disabled: true }, , Validators.required],
    });
  }

  editForm() {
    this.productForm.patchValue({
      product_title: this.arrProductDetail.product_title,
      product_sku: this.arrProductDetail.product_sku,
      product_price: this.arrProductDetail.product_price,
      note: this.arrProductDetail.note,
    });

    this.loading = false;
  }

  allProductIsActive(product, callbacl) {
    let status = true;
    product.forEach(item => {
      if (item.product_row_data.product_is_active === 0)
        status = false;
    });
    callbacl(status);
  }

  updateStatus(checked: boolean, data) {
    data.product_row_data.product_is_active = (checked) ? 1 : 0;
    this.allProductIsActive(this.arrProductDetails, res => {
      this.checkedAll = res;
    });

    const dataJson = {
      product_is_active: data.product_row_data.product_is_active,
      product_json: [{
        distributor_product_id: data.product_row_data.distributor_product_id,
        create_time: data.product_row_data.create_time,
      }]
    }
    console.log('dataJson', dataJson);

    this.productAPIService.updateStatusDist(JSON.stringify(dataJson)).subscribe(res => {
      console.log(res);
    })


  }

  updateStatusAll(checked: boolean) {
    console.log('checked', checked);
    this.arrProductDetails.forEach(element => {
      element.product_row_data.product_is_active = (checked) ? 1 : 0;
    });

    const param_json = [];
    for (let index = 0; index < this.arrProductDetails.length; index++) {
      param_json.push({
        distributor_product_id: this.arrProductDetails[index].product_row_data.distributor_product_id,
        create_time: this.arrProductDetails[index].product_row_data.create_time
      });
    }

    const dataJson = {
      product_is_active: this.arrProductDetails[0].product_row_data.product_is_active,
      product_json: param_json
    }

    console.log('dataJson', dataJson);

    this.productAPIService.updateStatusDist(JSON.stringify(dataJson)).subscribe(res => {
      console.log(res);
    })

  }

  btnCancelClick() {
    if (this.status === "list") {
      this.router.navigate([this.UrlRouter_Products]);
    }
    if (this.status === "group") {
      this.router.navigate([this.UrlRouter_ProductsGroup]);
    }

    if (this.status === "stock") {
      this.router.navigate([this.UrlRouter_ProductsStock]);
    }

  }

  openImg(img: any) {
    this.dialogService.open(DialogsImageComponent, {
      context: {
        imgURL: img,
      },
    });
  }

  btnUpdateStock() {

    const param_product_json = [];
    for (let index = 0; index < this.arrProductDetails.length; index++) {
      param_product_json.push({
        warehouse_id: this.arrProductDetails[index].warehouse_id,
        checkin_data: this.arrProductDetails[index].checkin_data,
        distributor_product_id: this.arrProductDetails[index].purchase_data[0].distributor_product_id,
        distributor_product_create_time: (new Date()).getTime() / 1000

      });
    }
    console.log(param_product_json);
    this.updateStock(param_product_json)


  }

  updateStock(param_product_json) {

    const dataJson = {
      "product_json": param_product_json
    }

    console.log(JSON.stringify(dataJson)
    );
    this.productAPIService.updateStockDist(JSON.stringify(dataJson)).subscribe(data => {
      console.log(data);
    })

  }


}