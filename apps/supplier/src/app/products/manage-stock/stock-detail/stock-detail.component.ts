import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ProductAPIService, UploadAPIService } from "@project/services";
import { ProductData } from "@project/interfaces";
import { DialogsImageComponent } from "../../../dialogs/dialogs-image/dialogs-image.component";
import { NbDialogService } from "@nebular/theme";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";

@Component({
  selector: "project-stock-detail",
  templateUrl: "./stock-detail.component.html",
  styleUrls: ["./stock-detail.component.scss"]
})
export class StockDetailComponent implements OnInit {
  private UrlRouter_Products = "products/stock/list";
  private UrlRouter_ProductCreate = "products/manage/create";
  arrProductDetail: any = [];
  arrProductDetails: any = [];
  arrWholesale: any = [];
  RowID: string;
  supplier_name: string;
  product_category_name: string;
  loading = false;
  Form: FormGroup;

  product = {
    update: false,
    main_image: {
      get: [],
      port: []
    },
    product_image_array: {
      get: [],
      port: []
    },
    product_image_array_state: true
  };

  get wholesale(): FormArray {
    return this.Form.get('wholesale') as FormArray;
  }


  constructor(
    private router: Router,
    private productAPIService: ProductAPIService,
    private route: ActivatedRoute,
    private dialogService: NbDialogService,
    private formBuilder: FormBuilder,
    private uploadAPIService: UploadAPIService
  ) {
    this.loading = true;
  }

  ngOnInit() {
    this.buildForms();
    const params = this.route.snapshot.paramMap;
    if (params.has("id")) {
      this.RowID = params.get("id");

      if (this.RowID === "new") {
      } else {
        this.productAPIService
          .getProductDetailSup(this.RowID)
          .subscribe(data => {
            console.log("getProductDetailSup : data : ", data);

            data.response_data.forEach(item => {
              this.arrProductDetail = item;
              console.log("getProductDetailSup : item : ", item);
              if (
                this.arrProductDetail.product_image_url !== undefined &&
                this.arrProductDetail.product_image_url !== "-" &&
                this.arrProductDetail.product_image_url !== ""
              )
                this.uploadAPIService
                  .uploadImage()
                  .getUrl(
                    this.arrProductDetail.product_image_url,
                    red_image => {
                      this.product.main_image.get.push(red_image);
                    }
                  );
              if (this.arrProductDetail.product_image_array !== undefined)
                this.uploadAPIService
                  .uploadImage()
                  .imageArray(
                    this.arrProductDetail.product_image_array,
                    imageArray => {
                      this.product.product_image_array.get = imageArray;
                    }
                  );
            });

            this.arrWholesale = this.arrProductDetail.product_wholesale_array;

            this.arrWholesale.forEach(element => {
              element.product_price =
                element.product_price % 1 !== 0
                  ? element.product_price
                  : element.product_price + ".00";
              element.retail_product_price =
                element.retail_product_price % 1 !== 0
                  ? element.retail_product_price
                  : element.retail_product_price + ".00";
            });
            this.arrWholesale.sort((a, b) => a.qty_minimum - b.qty_minimum);

            this.getProductDetail(this.arrProductDetail);
            this.detailForm();
          });
      }
    }
  }

  getProductDetail(data: any) {
    this.arrProductDetails = data.product_warehouse_array;
    if (data.product_category_array.length > 0) {
      this.product_category_name =
        data.product_category_array[0].product_category_name;
    } else {
      this.product_category_name = "";
    }
    this.loading = false;
    // this.supplier_name = this.arrProductDetail.supplier_reference.supplier_name
  }

  buildForms() {
    this.Form = this.formBuilder.group({
      product_category_name: [
        { value: "", disabled: true },
        Validators.required
      ],
      product_name: [{ value: "", disabled: true }, Validators.required],
      product_price: [{ value: "", disabled: true }, Validators.required],
      product_sku: [{ value: "", disabled: true }, Validators.required],
      product_unit: [{ value: "", disabled: true }, Validators.required],
      category_custom_keyword: [
        { value: "", disabled: true },
        Validators.required
      ],
      product_currency_code: [
        { value: "", disabled: true },
        Validators.required
      ],
      initial_stock: [{ value: "", disabled: true }, Validators.required],
      product_barcode: [{ value: "", disabled: true }, Validators.required],
      product_country: [{ value: "", disabled: true }, Validators.required],
      product_channel: [{ value: "", disabled: true }, Validators.required],
      warehouse_name: [{ value: "", disabled: true }, Validators.required],
      product_public_status_id: [
        { value: "", disabled: true },
        Validators.required
      ],
      width: [{ value: "", disabled: true }, Validators.required],
      weight: [{ value: "", disabled: true }, Validators.required],
      height: [{ value: "", disabled: true }, Validators.required],
      width_unit: [{ value: "", disabled: true }, Validators.required],
      weight_unit: [{ value: "", disabled: true }, Validators.required],
      height_unit: [{ value: "", disabled: true }, Validators.required],
      wholesale: this.formBuilder.array([])
    });

  }

  detailForm() {
    const onhand =
      this.arrProductDetail.product_warehouse_array.length === 0
        ? ""
        : this.arrProductDetail.product_warehouse_array[0].onhand;
    this.Form.patchValue({
      product_category_name: this.arrProductDetail.product_category_array[0]
        .product_category_name,
      product_name: this.arrProductDetail.product_name,
      product_price:
        this.arrProductDetail.product_price % 1 !== 0
          ? this.arrProductDetail.product_price
          : this.arrProductDetail.product_price + ".00",
      product_sku: this.arrProductDetail.product_sku,
      product_unit: this.arrProductDetail.product_unit,
      category_custom_keyword: this.arrProductDetail.category_custom_keyword,
      product_currency_code: this.arrProductDetail.product_currency_code,
      initial_stock: onhand,
      product_barcode: this.arrProductDetail.product_barcode,
      product_country: this.arrProductDetail.product_country,
      product_channel: this.arrProductDetail.product_channel,
      warehouse_name:
        this.arrProductDetail.product_warehouse_array.length === 0
          ? ""
          : this.arrProductDetail.product_warehouse_array[0].warehouse_name,
      product_public_status_id:
        this.arrProductDetail.product_public_status_id === 1
          ? "Active"
          : "Inactive",
      width: this.arrProductDetail.product_attribute.width,
      weight: this.arrProductDetail.product_attribute.weight,
      height: this.arrProductDetail.product_attribute.height,
      width_unit: this.arrProductDetail.product_attribute.width_unit,
      weight_unit: this.arrProductDetail.product_attribute.weight_unit,
      height_unit: this.arrProductDetail.product_attribute.height_unit,
    });

    // wholesale
    this.arrProductDetail.product_wholesale_array.forEach(element => {
      element.disabled = true;
      this.wholesale.push(
        this.formBuilder.group(element)
      );
    });

    this.Form.disable();
    this.wholesale.disable();

    this.loading = false;
  }

  btnCancelClick() {
    this.router.navigate([this.UrlRouter_Products]);
  }

  btnEditeClick() {
    this.router.navigate([
      this.UrlRouter_ProductCreate,
      this.arrProductDetail.supplier_product_id
    ]);
  }

  openImg(img: any) {
    this.dialogService.open(DialogsImageComponent, {
      context: {
        imgURL: img
      }
    });
  }
}
