import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import {
  ProductAPIService,
  UploadAPIService,
  BrowseSupplierAPIService,
  WarehouseAPIService,
  ReusableReactiveFormService
} from "@project/services";
import { DialogsCancelComponent } from "../../../dialogs/dialogs-cancel/dialogs-cancel.component";
import { NbDialogService } from "@nebular/theme";

// file service & external data
import JSON_PROVINCE from "../../../../../../../libs/shared/src/lib/json/province.json";
import JSON_LOCATION from "../../../../../../../libs/shared/src/lib/json/location.json";
import JSON_LOCATION_DETAIL from "../../../../../../../libs/shared/src/lib/json/location_detail.json";
import JSON_CURRENCY from "../../../../../../../libs/shared/src/lib/json/currency.json";

import { ProductWholesaleComponent } from "../../../dialogs/product-wholesale/product-wholesale.component";
import { WarehouseCreateComponent } from "../../../dialogs/warehouse-create/warehouse-create.component";
import { AleartComponent } from "../../../dialogs/aleart/aleart.component";

@Component({
  selector: "project-products-create",
  templateUrl: "./products-create.component.html",
  styleUrls: ["./products-create.component.scss"]
})
export class ProductsCreateComponent implements OnInit {
  private URLRputer_ProductList = "products/manage/list";
  private URLRputer_ProductDetail = "products/manage/detail";
  arrobjRow: any = [];
  arrobjCategory: any = [];
  arrWarehouse: any = [];
  arrUnitWH = [{ unit_name: "cm" }];
  arrUnitWeight = [{ unit_name: "kg" }];
  productForm: FormGroup;
  submitted = false;
  strWholesal = false;
  imagePath: any = [];
  uploadData: any = [];
  imgURL: any;
  public message = "No File chosen";
  arrWholesale: any = [];
  RowID: string;
  files: any = [];
  strCateName: string;
  strUpdateName: string;
  warehouse_name: string;
  active = 1;
  id_local: string;
  product_category__name: string;
  sort: boolean;
  loading = false;
  product_category_root_id: number;

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

  channel: any = {
    one: {
      input: "",
      channel: "",
      channel_array: []
    }
  };

  arrProvince: any[] = JSON_PROVINCE;
  arrCountry: any[];
  arrLocation: any[] = JSON_LOCATION;
  arrLocationDetail: any[] = JSON_LOCATION_DETAIL;
  arrCurrency: any[] = JSON_CURRENCY;


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private productAPIService: ProductAPIService,
    private route: ActivatedRoute,
    private uploadAPIService: UploadAPIService,
    private browseSupplierAPIService: BrowseSupplierAPIService,
    private dialogService: NbDialogService,
    private warehouseAPIService: WarehouseAPIService,
    private validForm: ReusableReactiveFormService
  ) {
    this.id_local = localStorage.getItem("id");
    console.log(" this.id_local", this.id_local);
    this.loading = true;
  }

  ngOnInit() {
    this.buildForm();
    this.get_Country(0);

    const params = this.route.snapshot.paramMap;
    if (params.has("id")) {
      this.RowID = params.get("id");
      if (this.RowID === "new") {
        this.getCategory();
        this.getWarehouse();
        this.loading = false;
      } else {
        this.productAPIService.getProductDetailSup(this.RowID).subscribe(data => {
          this.arrobjRow = data.response_data[0];

          //Images
          if (
            this.arrobjRow.product_image_url !== undefined &&
            this.arrobjRow.product_image_url !== "-" &&
            this.arrobjRow.product_image_url !== ""
          )
            this.uploadAPIService.uploadImage().getUrl(this.arrobjRow.product_image_url,
              red_image => {
                this.product.main_image.get.push(red_image);
              });
          if (this.arrobjRow.product_image_array !== undefined)
            this.uploadAPIService.uploadImage().imageArray(this.arrobjRow.product_image_array,
              imageArray => {
                this.product.product_image_array.get = imageArray;
              }
            );

          this.imgURL = this.arrobjRow.product_image_url;

          //Wholesale
          this.arrWholesale = this.arrobjRow.product_wholesale_array;

          this.arrWholesale.forEach(element => {
            element.product_price = element.product_price % 1 !== 0
              ? element.product_price
              : element.product_price + ".00";
            element.retail_product_price = element.retail_product_price % 1 !== 0
              ? element.retail_product_price
              : element.retail_product_price + ".00";
          });
          this.arrWholesale.sort((a, b) => a.qty_minimum - b.qty_minimum);
          this.sort = true;

          //Channel
          this.channelArray().getObjectArray(this.arrobjRow.product_channel,
            getObjectArray => {
              this.channel.one.channel = this.arrobjRow.product_channel;
              this.channel.one.channel_array = getObjectArray;
            }
          );

          this.getCategory();
          this.getWarehouse();
        });
      }
    }
  }

  buildForm() {
    this.productForm = this.formBuilder.group({
      productCategory: ["", Validators.required],
      productName: ["", Validators.required],
      productPrice: ["", Validators.required],
      productSKU: ["", Validators.required],
      productUnit: ["", Validators.required],
      category_custom_keyword: ["", Validators.required],
      product_country: ["", Validators.required],
      product_barcode: ["", Validators.required],
      product_currency_code: ["", Validators.required],
      warehouse_id: ["", Validators.required],
      initial_stock: ["", Validators.required],
      width: ["", Validators.required],
      width_unit: ["", Validators.required],
      height: ["", Validators.required],
      height_unit: ["", Validators.required],
      weight: ["", Validators.required],
      weight_unit: ["", Validators.required],
      sku: [],
      warehouse_name: [{ value: "", disabled: true }],
      wholesale: this.formBuilder.array([])

    });
    // product_channel: ['', Validators.required],
    this.productForm.get("product_currency_code").patchValue("THB");
    this.productForm.get("width_unit").patchValue("cm");
    this.productForm.get("height_unit").patchValue("cm");
    this.productForm.get("weight_unit").patchValue("kg");
    this.productForm.get("product_country").patchValue("Thailand");
    console.log(this.productForm)
  }

  editForm() {
    console.log("data : ", this.arrobjRow);

    this.productForm.patchValue({
      productCategory: this.arrobjRow.product_category_array[0]
        .product_category_id,
      productName: this.arrobjRow.product_name,
      productPrice:
        this.arrobjRow.product_buy_price % 1 !== 0
          ? this.arrobjRow.product_buy_price
          : this.arrobjRow.product_buy_price + ".00",
      productSKU: this.arrobjRow.product_sku,
      productUnit: this.arrobjRow.product_unit,
      category_custom_keyword: this.arrobjRow.category_custom_keyword,
      product_country: this.arrobjRow.product_country,
      product_barcode: this.arrobjRow.product_barcode,
      product_currency_code: this.arrobjRow.product_currency_code,
      initial_stock:
        this.arrobjRow.product_warehouse_array[0].onhand,
      sku: this.arrobjRow.product_sku,
      width: this.arrobjRow.product_attribute.width,
      weight: this.arrobjRow.product_attribute.weight,
      height: this.arrobjRow.product_attribute.height,
      width_unit: this.arrobjRow.product_attribute.width_unit,
      weight_unit: this.arrobjRow.product_attribute.weight_unit,
      height_unit: this.arrobjRow.product_attribute.height_unit,
    });

    // wholesale
    this.arrobjRow.product_wholesale_array.forEach(element => {
      this.wholesale.push(
        this.formBuilder.group(element)
      );
    });

    // product_channel: this.arrobjRow.product_channel,
    this.productForm.get("initial_stock").disable();
    this.active = this.arrobjRow.product_public_status_id;

    //check cate id 
    //this.product_category_root_id = +this.arrobjRow.product_category_array[0].product_category_root_id === 0 ? +this.arrobjRow.product_category_array[0].product_category_id : +this.arrobjRow.product_category_array[0].product_category_root_id;
    this.product_category_root_id = +this.arrobjRow.product_category_array[0].product_category_id;

    this.loading = false;
    console.log(this.productForm)
    console.log(this.wholesale)
  }

  get wholesale(): FormArray {
    return this.productForm.get('wholesale') as FormArray;
  }

  get f
    () {
    return this.productForm.controls;
  }

  onSubmit() {
    if (this.productForm.invalid) {
      return;
    }
  }

  getCategory() {
    const value =
      "cur_page=" + 1 + "&per_page=" + 10 + "&product_category_id=" + 0;
    this.browseSupplierAPIService.getCategory(value).subscribe(data => {
      this.arrobjCategory = data.response_data;
      if (this.RowID !== "new") {
        this.strUpdateName = this.arrobjRow.product_category_array[0].product_category_name;
        setTimeout(() => {
          this.productForm.get("productCategory").patchValue(Number(this.arrobjRow.product_category_array[0].product_category_id));
          this.product_category__name = this.arrobjRow.product_category_array[0].product_category_name;
          console.log("this.product_category__name", this.product_category__name
          );
        }, 0);
        this.editForm();
      }
    });
  }

  getWarehouse() {
    const value = "&supplier_id=" + this.id_local + "&warehouse_type_id=" + 1;
    this.warehouseAPIService.getWarehouseList(value).subscribe(data => {
      this.arrWarehouse = data.response_data;
      console.log("this.arrWarehouse : this.arrWarehouse", this.arrWarehouse);
      if (this.RowID !== "new") {
        setTimeout(() => {
          this.productForm.get("warehouse_id").patchValue(this.arrobjRow.product_warehouse_array[0].warehouse_id);
          this.productForm.get("warehouse_name").patchValue(this.arrobjRow.product_warehouse_array[0].warehouse_name);
        }, 0);
      }
    });
  }

  async get_Country(location_type_id) {
    const get_detail_by_id = id => {
      return this.arrLocationDetail.filter(row => {
        if (row.location_id === id) {
          return true;
        }
        return false;
      });
    };

    const newArray = [];
    await this.arrLocation.forEach(row => {
      if (row.parent_id === 0) {
        const detail_data_array = get_detail_by_id(row.location_id);
        row.location_name = detail_data_array[0].name;
        row.location_postcode = Number(row.postcode);

        newArray.push({
          location_id: row.location_id,
          location_name: detail_data_array[0].name,
          location_postcode: Number(row.postcode)
        });

        return true;
      }
      return false;
    });

    this.arrCountry = newArray;

    // console.log("arrCountry : arrCountry", this.arrCountry);
  }

  addWholesale() {
    const dialogRef = this.dialogService.open(ProductWholesaleComponent, {});
    dialogRef.onClose.subscribe(result => {
      if (result !== undefined) {

        result.product_price = result.product_price % 1 !== 0 ? result.product_price : result.product_price + ".00";
        result.retail_product_price = result.retail_product_price % 1 !== 0 ? result.retail_product_price : result.retail_product_price + ".00";
        console.log("result", result);

        this.wholesale.push(
          this.formBuilder.group(result)
        );

        const array = this.productForm.controls.wholesale.value
        array.sort((a, b) => a.qty_minimum - b.qty_minimum)
        this.productForm.controls.wholesale.patchValue(array)

      }
    });
  }

  sortWholesale() {
    if (this.sort) {
      const array = this.productForm.controls.wholesale.value;
      array.sort((a, b) => b.qty_minimum - a.qty_minimum);
      this.productForm.controls.wholesale.patchValue(array);

      // this.arrWholesale.sort((a, b) => b.qty_minimum - a.qty_minimum);
      this.sort = false;
    } else {
      const array = this.productForm.controls.wholesale.value;
      array.sort((a, b) => a.qty_minimum - b.qty_minimum);
      this.productForm.controls.wholesale.patchValue(array);

      // this.arrWholesale.sort((a, b) => a.qty_minimum - b.qty_minimum);
      this.sort = true;
    }
  }

  onKeyInitialStock(searchValue): void {
    console.log("searchValue", searchValue);
    if (searchValue <= 0 || searchValue === "") {
      const dialogRef = this.dialogService.open(AleartComponent, {
        context: {
          status: "Quantity"
        }
      });
      dialogRef.onClose.subscribe(result => {
        if (result === "ok") {
          this.productForm.get("initial_stock").patchValue(1);
        }
      });
    }
  }

  onKeyMinimum(searchValue, data): void {
    console.log(data);
    if (data.value.qty_minimum <= 0 || data.value.qty_minimum === "") {
      data.value.qty_minimum = 1;
      const dialogRef = this.dialogService.open(AleartComponent, {
        context: {
          status: "Quantity"
        }
      });
      dialogRef.onClose.subscribe(result => {
        if (result === "ok") {
          data.value.qty_minimum = 1;
        }
      });
    }
  }

  onCheckWholesale(event) {
    const array = this.productForm.controls.wholesale.value
    array.sort((a, b) => a.qty_minimum - b.qty_minimum)
    this.productForm.controls.wholesale.patchValue(array)
  }

  addWarehouse() {
    const dialogRef = this.dialogService.open(WarehouseCreateComponent, {});

    dialogRef.onClose.subscribe(result => {
      console.log("result", result);
      if (result !== undefined) {
        this.getWarehouse();
      }
    });
  }

  deleteWholesale(i) {
    const control = <FormArray>this.productForm.controls['wholesale'];
    control.removeAt(i);
    // this.arrWholesale.splice(i, 1);
  }

  categoryEvent(event) {
    // if (this.RowID === "new")
    if (event.product_category__id !== 0) {
      if (event.product_category__name === "Other") {
        this.productForm.get("productCategory").patchValue(event.product_category__id);
        this.productForm.get("category_custom_keyword").patchValue("");
      } else {
        this.productForm.get("productCategory").patchValue(event.product_category__id);
        this.productForm.get("category_custom_keyword").patchValue("-");
      }
      this.product_category__name = event.product_category__name;
    } else {
      this.productForm.get("productCategory").patchValue("");
      this.productForm.get("category_custom_keyword").patchValue("-");
      this.product_category__name = event.product_category__name;
    }
    console.log("event", event);
    console.log("product_category__name", this.product_category__name);
  }

  btnIDClick(options) {
    console.log(options);

    if (options.length > 0) {
      this.warehouse_name = options[0].data.warehouse_name;
    }
    console.log("warehouse_name", this.warehouse_name);
  }

  toggle(_event_) {
    console.log("toggle : _event_ : ", _event_);
    if (_event_) {
      this.active = 1;
    } else {
      this.active = 0;
    }
  }

  checkWholesale() {
    const dialogRef = this.dialogService.open(AleartComponent, {
      context: {
        status: "wholesale"
      }
    });
    dialogRef.onClose.subscribe(result => {
      if (result === "ok") {
        return;
      }
    });
  }

  checkQtyMinimum() {

    // const { validateAllFormFields } = this.validForm;
    // const formErrors = validateAllFormFields(this.productForm);
    // console.log('formErrors', formErrors);
    // if (formErrors.length > 0) {
    //   // alert(`Please check your information to correct the right pattern...`);
    //   return;
    // }
    // this.router.navigateByUrl("/storemanager/dashboard/customer/manager");

    this.productForm.get("productName").patchValue(this.productForm.value.productName.replace(/[^\u0E00-\u0E7Fa-zA-Z_0-9 \.\-\(\)\&]/g, ""));
    this.productForm.get("productSKU").patchValue(this.productForm.value.productSKU.replace(/[^a-zA-Z_0-9 \.\-]/g, ""));
    this.productForm.get("productUnit").patchValue(this.productForm.value.productUnit.replace(/[^\u0E00-\u0E7Fa-zA-Z \.\-]/g, ""));
    this.productForm.get("product_barcode").patchValue(this.productForm.value.product_barcode.replace(/[^A-Z_0-9]/g, ""));
    console.log(this.productForm.value);

    //Check Vailidate
    this.submitted = true;
    if (
      this.productForm.invalid || this.product.update || !this.product.product_image_array_state
    ) {
      return;
    }

    //Check Qty Minimum
    const array = this.productForm.controls.wholesale.value
    const lookup = array.reduce((a, e) => {
      a[e.qty_minimum] = ++a[e.qty_minimum] || 0;
      return a;
    }, {});

    const value = array.filter(e => lookup[e.qty_minimum]);

    if (value.length > 0) {
      const dialogRef = this.dialogService.open(AleartComponent, {
        context: {
          status: "Product QtyMinimum",
          data: value
        }
      });
      dialogRef.onClose.subscribe(result => {
        if (result === "ok") {
          return;
        }
      });
    } else {
      this.btnSaveClick();
      // if (this.arrWholesale.length > 0) {
      //   this.strWholesal = false;
      //   this.btnSaveClick();
      // } else {
      //   this.checkWholesale();
      //   this.strWholesal = true;
      // }
    }

  }

  btnSaveClick() {
    this.uploadAPIService
      .uploadImage()
      .getImageArrayState(this.product.product_image_array.get, state => {
        this.product.product_image_array_state = state;

        //Check Whosale
        const array = this.productForm.controls.wholesale.value
        array.forEach(element => {
          element.product_price = +element.product_price;
          element.retail_product_price = +element.retail_product_price;
        });
        array.sort((a, b) => a.qty_minimum - b.qty_minimum)


        let channel = {
          one: {
            target: {
              value: this.channel.one.input
            }
          }
        };
        this.channelArray().inArrayObjectInput(channel.one, this.channel.one);

        //Check SKU
        const dataJson = {
          supplier_id: this.id_local,
          product_sku: this.productForm.value.productSKU
        };
        console.log("SKU : dataJson", dataJson);

        if (this.RowID === "new") {
          this.productAPIService
            .postSKU(JSON.stringify(dataJson))
            .subscribe(res => {
              console.log(res);
              if (res.response_data === 1) {
                this.product.update = true;
                const dataSend = {
                  type_id: 120,
                  file_name: "",
                  file_type: "",
                  supplier_id: this.id_local,
                  user_id: 0
                };
                this.uploadAPIService
                  .uploadImage()
                  .getImageArray(
                    dataSend,
                    this.product.main_image.get,
                    red_image_array => {
                      console.log(
                        "btnSaveClick : red_image_array : ",
                        red_image_array
                      );
                      this.product.main_image.port = red_image_array;
                      this.uploadAPIService
                        .uploadImage()
                        .getImageArray(
                          dataSend,
                          this.product.product_image_array.get,
                          red_product_image_array => {
                            console.log(
                              "btnSaveClick : red_product_image_array : ",
                              red_product_image_array
                            );
                            this.product.product_image_array.port = red_product_image_array;
                            this.save();
                          }
                        );
                    }
                  );
              } else {
                const dialogRef = this.dialogService.open(AleartComponent, {
                  context: {
                    status: "sku"
                  }
                });
                dialogRef.onClose.subscribe(result => { });
              }
            });
        } else {
          if (
            this.productForm.value.sku === this.productForm.value.productSKU
          ) {
            this.product.update = true;
            const dataSend = {
              type_id: 120,
              file_name: "",
              file_type: "",
              supplier_id: this.id_local,
              user_id: 0
            };
            this.uploadAPIService.uploadImage().getImageArray(dataSend, this.product.main_image.get, red_image_array => {
              console.log("btnSaveClick : red_image_array : ", red_image_array);
              this.product.main_image.port = red_image_array;
              this.uploadAPIService.uploadImage().getImageArray(dataSend, this.product.product_image_array.get, red_product_image_array => {
                console.log("btnSaveClick : red_product_image_array : ", red_product_image_array);
                this.product.product_image_array.port = red_product_image_array;
                this.save();
              }
              );
            }
            );
          } else {
            this.productAPIService.postSKU(JSON.stringify(dataJson)).subscribe(res => {
              console.log(res);
              if (res.response_data === 1) {
                this.product.update = true;
                const dataSend = {
                  type_id: 120,
                  file_name: "",
                  file_type: "",
                  supplier_id: this.id_local,
                  user_id: 0
                };
                this.uploadAPIService.uploadImage().getImageArray(dataSend, this.product.main_image.get, red_image_array => {
                  console.log("btnSaveClick : red_image_array : ", red_image_array);
                  this.product.main_image.port = red_image_array;
                  this.uploadAPIService.uploadImage().getImageArray(dataSend, this.product.product_image_array.get, red_product_image_array => {
                    console.log("btnSaveClick : red_product_image_array : ", red_product_image_array);
                    this.product.product_image_array.port = red_product_image_array;
                    this.save();
                  }
                  );
                }
                );
              } else {
                const dialogRef = this.dialogService.open(AleartComponent, {
                  context: {
                    status: "sku"
                  }
                });
                dialogRef.onClose.subscribe(result => { });
              }
            });
          }
        }
      });
  }

  save() {
    this.productForm.get("initial_stock").enable();
    this.productForm.get("warehouse_id").enable();

    if (this.RowID === "new") {
      const dataJson = {
        product_image_url:
          this.product.main_image.port.length > 0
            ? this.product.main_image.port[0].image_url
            : "-",
        product_name: this.productForm.value.productName,
        product_buy_price: +this.productForm.value.productPrice,
        product_price: +this.wholesale.value[0].product_price,
        product_sku: this.productForm.value.productSKU,
        product_unit: this.productForm.value.productUnit,
        supplier_id: this.id_local,
        product_wholesale_array: this.productForm.controls.wholesale.value,
        product_category_id: this.productForm.value.productCategory,
        category_custom_keyword: this.productForm.value.category_custom_keyword,
        product_currency_code: this.productForm.value.product_currency_code,
        product_barcode: this.productForm.value.product_barcode,
        product_country: this.productForm.value.product_country,
        product_channel: this.channel.one.channel,
        product_image_array: this.product.product_image_array.port,
        product_public_status_id: this.active,
        product_warehouse_array: [
          {
            warehouse_id: +this.productForm.value.warehouse_id,
            warehouse_name: this.warehouse_name,
            onhand: +this.productForm.value.initial_stock,
            available: 0,
            incoming: 0,
            outgoing: 0,
            change: 0
          }
        ],
        product_attribute: {
          weight: +this.productForm.value.weight,
          weight_unit: this.productForm.value.weight_unit,
          height: +this.productForm.value.height,
          height_unit: this.productForm.value.height_unit,
          width: +this.productForm.value.width,
          width_unit: this.productForm.value.width_unit,
        }
      };
      console.log(dataJson);
      this.productAPIService
        .addProducts(JSON.stringify(dataJson))
        .subscribe(data => {
          console.log(data);
          this.router.navigate([this.URLRputer_ProductList]);
        });
    } else {
      const dataJson = {
        product_image_url:
          this.product.main_image.port.length > 0
            ? this.product.main_image.port[0].image_url
            : "-",
        product_name: this.productForm.value.productName,
        product_buy_price: +this.productForm.value.productPrice,
        product_price: +this.wholesale.value[0].product_price,
        product_sku: this.productForm.value.productSKU,
        product_unit: this.productForm.value.productUnit,
        product_wholesale_array: this.productForm.controls.wholesale.value,
        product_category_id: this.productForm.value.productCategory,
        product_id: this.arrobjRow.supplier_product_id,
        category_custom_keyword: this.productForm.value.category_custom_keyword,
        product_currency_code: this.productForm.value.product_currency_code,
        product_barcode: this.productForm.value.product_barcode,
        product_country: this.productForm.value.product_country,
        product_channel: this.channel.one.channel,
        product_image_array: this.product.product_image_array.port,
        product_public_status_id: this.active,
        product_warehouse_array: [
          {
            warehouse_id: this.arrobjRow.product_warehouse_array[0]
              .warehouse_id,
            warehouse_name: this.arrobjRow.product_warehouse_array[0]
              .warehouse_name,
            onhand: +this.productForm.value.initial_stock,
            available: 0,
            incoming: 0,
            outgoing: 0,
            change: 0
          }
        ],
        product_attribute: {
          weight: +this.productForm.value.weight,
          weight_unit: this.productForm.value.weight_unit,
          height: +this.productForm.value.height,
          height_unit: this.productForm.value.height_unit,
          width: +this.productForm.value.width,
          width_unit: this.productForm.value.width_unit,
        }
      };
      console.log(dataJson);

      this.productAPIService
        .updateProducts(JSON.stringify(dataJson))
        .subscribe(data => {
          console.log(data);
          this.router.navigate([this.URLRputer_ProductList]);
        });
    }
  }

  btnCancelClick() {
    const dialogRef = this.dialogService.open(DialogsCancelComponent, {});

    dialogRef.onClose.subscribe(result => {
      if (result === "cancel") {
      }
      if (result === "ok") {
        this.router.navigate([this.URLRputer_ProductList]);
      }
    });
  }

  btnBackClick() {
    const dialogRef = this.dialogService.open(DialogsCancelComponent, {});

    dialogRef.onClose.subscribe(result => {
      if (result === "cancel") {
      }
      if (result === "ok") {
        this.router.navigate([this.URLRputer_ProductDetail, this.RowID]);
      }
    });
  }

  uploadFile(event) {
    if (event.length === 0) return;

    const mimeType = event[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }
    const reader = new FileReader();
    this.message = event[0].name;
    this.imagePath = event[0];
    reader.readAsDataURL(event[0]);
    reader.onload = _event => {
      this.imgURL = reader.result;
    };
    this.upload();
  }

  upload() {
    const dataJson = {
      type_id: 120,
      file_name: this.imagePath.name,
      file_type: this.imagePath.type,
      supplier_id: this.id_local,
      distributor_id: 0
    };

    this.uploadAPIService.uploadImg(JSON.stringify(dataJson)).subscribe(res => {
      console.log(res);
      this.uploadData = res.response_data[0];

      this.uploadAPIService
        .uploadPut(this.uploadData.file_upload_url, this.imagePath)
        .subscribe(res1 => {
          console.log(res1);
          this.arrobjRow.product_image_url = this.uploadData.file_url;
          console.log(this.arrobjRow.product_image_url);
        });
    });
  }

  btnUpload() {
    this.uploadAPIService
      .uploadPut(this.uploadData.file_upload_url, this.imagePath)
      .subscribe(res1 => {
        console.log(res1);
      });
  }

  channelArray() {
    let self = this;
    let function_object = {
      consoleLog(_function_, _title_, _data_) {
        let _self_ = this;
        console.log(_function_, " : ", _title_, " : ", _data_);
      },
      checkLength(
        _min_length_,
        _max_length_,
        _object_,
        callback: (res) => any
      ) {
        let _self_ = this;
        const res =
          _min_length_ <= _object_ &&
          (_object_ <= _max_length_ || _object_ > _max_length_);
        console.log(
          "checkLength : _min_length_ <= _object_ ",
          _min_length_ <= _object_
        );
        console.log(
          "checkLength :  _object_ <= _max_length_ ",
          _object_ <= _max_length_
        );
        callback(res);
      },
      checkIncludes(_object_, _new_object_, callback: (res) => any) {
        let _self_ = this;
        const res = _object_.includes(_new_object_);
        callback(res);
      },
      newObject(checkLength, _object_, _new_object_, callback: (res) => any) {
        let _self_ = this;
        const res = !checkLength
          ? _object_ != ""
            ? ",".concat(_new_object_)
            : _new_object_
          : "";
        callback(res);
      },
      getObjectArray(_object_, callback: (res) => any) {
        let _self_ = this;
        const res = _object_ !== "" ? _object_.split(",") : "";
        callback(res);
      },
      removeIndex(index, _object_array_, callback: (res) => any) {
        let _self_ = this;
        const res = _object_array_.splice(index, 1);
        callback(res);
      },
      getObject(_object_array_, callback: (res) => any) {
        let _self_ = this;
        let res = "";
        _object_array_.forEach(item => {
          _self_.newObject(false, res, item, newObject => {
            res = res.concat(newObject);
          });
        });
        callback(res);
      },
      replaceString(
        _replace_,
        _new_replace_,
        _object_,
        callback: (res) => any
      ) {
        let _self_ = this;
        let res = _object_.replace(_replace_, _new_replace_);
        callback(res);
      },
      matchString(_match_, _object_, callback: (res) => any) {
        let _self_ = this;
        let res = _object_.match(_match_) ? true : false;
        callback(res);
      },
      main(callback: (res) => any) {
        let _self_ = this;
        callback(_self_);
      },
      inArrayObjectInput(_event_, _object_) {
        let _self_ = this;
        _object_.input = _event_.target.value;
      },
      inArrayObject(_event_, _object_) {
        let _self_ = this;
        _self_.checkIncludes(
          _object_.channel,
          _event_.target.value,
          checkIncludes => {
            _self_.newObject(
              checkIncludes,
              _object_.channel,
              _event_.target.value,
              newObject => {
                _object_.channel = _object_.channel.concat(newObject);
                _self_.getObjectArray(_object_.channel, getObjectArray => {
                  _object_.channel_array = getObjectArray;
                  _event_.target.value = "";
                  _object_.input = _event_.target.value;
                });
              }
            );
          }
        );
      },
      removeObjectIndex(index, _object_) {
        let _self_ = this;
        _self_.removeIndex(index, _object_.channel_array, removeIndex => {
          _self_.getObject(_object_.channel_array, getObject => {
            _object_.channel = getObject;
          });
        });
      }
    };
    return function_object;
  }
}
