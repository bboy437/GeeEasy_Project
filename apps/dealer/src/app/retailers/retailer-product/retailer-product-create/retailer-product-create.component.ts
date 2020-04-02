import { NbDialogService } from "@nebular/theme";
import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { AleartComponent } from "../../../dialogs/aleart/aleart.component";
import { DialogsCancelComponent } from "../../../dialogs/dialogs-cancel/dialogs-cancel.component";
import {
  RetailProductService,
  UploadAPIService,
  WarehouseAPIService
} from "@project/services";
import { DeleteComponent } from "../../../dialogs/delete/delete.component";

@Component({
  selector: "project-retailer-product-create",
  templateUrl: "./retailer-product-create.component.html",
  styleUrls: ["./retailer-product-create.component.scss"]
})
export class RetailerProductCreateComponent implements OnInit {
  private retailerDetail = "retailers/retailer/detail";
  private retailerProductDetail = "retailers/product/detail";

  arrWarehouse: any = [];
  arrobjRow: any = {};
  objAPIResponse: any = {};
  retailId: string;
  RowID: string;
  Form: FormGroup;
  submitted = false;
  arrobjState: any = [];
  arrobjCity: any = [];
  arrobjTown: any = [];
  strZipcode: string;
  strState = "";
  strTown = "";
  strCity = "";
  isValidatorsstate = "";
  isValidatorsTown = "";
  isValidatorsCity = "";
  imagePath: any = [];
  uploadData: any = [];
  imgURL: any;
  public message = "No File chosen";
  arrCategory: any = [];
  product_category_id: string;
  loading = false;
  isReload = false;

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

  product_wholesale_array = [];

  id_local: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private dialogService: NbDialogService,
    private uploadAPIService: UploadAPIService,
    private retailProductService: RetailProductService,
    private warehouseAPIService: WarehouseAPIService
  ) {
    this.id_local = localStorage.getItem("id");
    console.log(" this.id_local", this.id_local);
    this.loading = true;
  }

  ngOnInit() {
    this.buildForm();
    const params = this.route.snapshot.paramMap;
    this.RowID = params.get("id");
    this.retailId = params.get("retail_id");
    if (this.RowID === "new") {
      this.loading = false;
      /* this.getWarehouse(); */
      this.valueForm();
    } else {
      this.getSalerepAccountDetail(res => {
        this.arrobjRow = res.response_data[0];
        this.imgURL = res.response_data[0].product_image_url;
        if (
          this.arrobjRow.product_image_url !== undefined &&
          this.arrobjRow.product_image_url !== "-" &&
          this.arrobjRow.product_image_url !== ""
        )
          this.uploadAPIService
            .uploadImage()
            .getUrl(this.arrobjRow.product_image_url, red_image => {
              this.product.main_image.get.push(red_image);
            });
        if (this.arrobjRow.product_image_array !== undefined)
          this.uploadAPIService
            .uploadImage()
            .imageArray(this.arrobjRow.product_image_array, imageArray => {
              this.product.product_image_array.get = imageArray;
            });
        if (this.arrobjRow.product_wholesale_array !== undefined) {
          this.arrobjRow.product_wholesale_array.forEach(item => {
            this.productWholesaleArray().get(item, red => {
              const product_price = parseFloat(
                red.product_wholesale.product_price
              );
              const discount_thb = parseFloat(
                red.product_wholesale.discount_thb
              );
              const discount_percent = parseFloat(
                red.product_wholesale.discount_percent
              );
              this.productWholesaleArray().calculate(
                product_price,
                discount_thb,
                discount_percent,
                (
                  red_product_price,
                  red_discount_thb,
                  red_discount_percent,
                  red_product_discount
                ) => {
                  red.product_discount = red_product_discount;
                  this.product_wholesale_array.push(red);
                }
              );
            });
          });
        }
        this.loading = false;
        this.valueForm();
        /* this.getWarehouse(); */
      });
    }
  }

  clickUpdateOrNew() {
    if (this.loading) return;
    this.btnSaveClick();
  }

  clickCancelOrBack() {
    switch (this.RowID) {
      case "new":
        this.btnCancelClick();
        break;

      default:
        this.btnBackClick();
        break;
    }
  }

  getSalerepAccountDetail(callback: (res) => any) {
    const params = this.route.snapshot.paramMap;
    this.RowID = params.get("id");
    this.retailProductService
      .getRetailProductDetail(this.RowID)
      .subscribe(res => {
        console.log("getSalerepAccountDetail : res : ", res);
        callback(res);
      });
  }

  valueForm() {
    this.Form.patchValue({
      /* warehouse_id: this.arrobjRow.warehouse_id, */
      product_title: this.arrobjRow.product_title,
      product_sku: this.arrobjRow.product_sku,
      product_stock:
        this.arrobjRow.checkin_data !== undefined
          ? this.arrobjRow.checkin_data.onhand !== undefined
            ? this.arrobjRow.checkin_data.onhand
            : ""
          : "",
      product_price: this.arrobjRow.product_price
    });
  }

  get f() {
    return this.Form.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.Form.invalid) {
      return;
    }
  }

  buildForm() {
    this.Form = this.formBuilder.group({
      /* warehouse_id: ["", Validators.required], */
      product_title: ["", Validators.required],
      product_sku: ["", Validators.required],
      product_stock: ["", Validators.required],
      product_price: ["", Validators.required]
    });
  }

  //--------------------------------------------

  btnSaveClick() {
    console.log("btnSaveClick : Form : ", this.Form);
    const product_wholesale_array_new = [];
    const product_wholesale_array = {
      status: false,
      product_wholesale_array_new: []
    };
    this.product_wholesale_array.forEach(item => {
      console.log(
        "btnSaveClick : product_wholesale_array.status : ",
        product_wholesale_array.status
      );
      product_wholesale_array.status = !product_wholesale_array.status
        ? item.status.qty_minimum || item.status.product_price
          ? true
          : false
        : true;
      for (const key in item.product_wholesale) {
        if (item.product_wholesale.hasOwnProperty(key)) {
          item.product_wholesale[key] = Number(item.product_wholesale[key]);
        }
      }
      product_wholesale_array.product_wholesale_array_new.push(
        item.product_wholesale
      );
    });
    this.submitted = true;
    console.log(
      "btnSaveClick : product_wholesale_array : ",
      product_wholesale_array
    );
    if (
      this.Form.invalid ||
      this.product.update ||
      product_wholesale_array.status
    )
      return;
    this.product.update = true;
    const dataSend = {
      type_id: 641,
      file_name: "",
      file_type: "",
      dealer_id: this.id_local,
      retail_id: this.retailId
    };
    this.uploadAPIService
      .uploadImage()
      .getImageArray(dataSend, this.product.main_image.get, red_image_array => {
        console.log("btnSaveClick : red_image_array : ", red_image_array);
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
              this.save(product_wholesale_array.product_wholesale_array_new);
            }
          );
      });
  }

  save(product_wholesale_array_new) {
    if (this.RowID === "new") {
      this.arrobjRow.dealer_id = this.id_local;
      this.arrobjRow.retail_id = Number(this.retailId);
      this.arrobjRow.distributor_id = 0;
      this.arrobjRow.supplier_id = 0;
      this.arrobjRow.group_id = 0;
      this.arrobjRow.user_id = 0;
      this.arrobjRow.product_title = this.Form.value.product_title;
      this.arrobjRow.product_sku = this.Form.value.product_sku;
      this.arrobjRow.product_price = this.Form.value.product_price;
      /* this.arrobjRow.product_image_url = this.arrobjRow.product_image_url; */
      this.arrobjRow.product_image_url =
        this.product.main_image.port.length > 0
          ? this.product.main_image.port[0].product_image_url
          : "-";
      this.arrobjRow.product_image_array = this.product.product_image_array.port;
      this.arrobjRow.warehouse_id = this.Form.value.warehouse_id;
      this.arrobjRow.checkin_data = {
        available: 0,
        change: 0,
        onhand: Number(this.Form.value.product_stock),
        incoming: 0,
        outgoing: 0
      };
      this.arrobjRow.product_wholesale_array = product_wholesale_array_new;
      this.arrobjRow.retail_product_status = 1;
      this.arrobjRow.retail_product_status_id = 1;
      const dataJson = JSON.stringify(this.arrobjRow);
      console.log("save : dataJson : ", dataJson);
      this.retailProductService
        .postRetailProductCreate(dataJson)
        .subscribe(res => {
          this.router.navigate([this.retailerDetail, this.retailId]);
        });
    } else {
      this.arrobjRow.product_title = this.Form.value.product_title;
      this.arrobjRow.product_sku = this.Form.value.product_sku;
      this.arrobjRow.product_price = this.Form.value.product_price;
      this.arrobjRow.warehouse_id = this.Form.value.warehouse_id;
      this.arrobjRow.checkin_data = {
        available: 0,
        change: 0,
        onhand: Number(this.Form.value.product_stock),
        incoming: 0,
        outgoing: 0
      };
      this.arrobjRow.product_wholesale_array = product_wholesale_array_new;
      /* this.arrobjRow.product_image_url = this.arrobjRow.product_image_url; */
      this.arrobjRow.product_image_url =
        this.product.main_image.port.length > 0
          ? this.product.main_image.port[0].image_url
          : "-";
      this.arrobjRow.product_image_array = this.product.product_image_array.port;
      const dataJson = JSON.stringify(this.arrobjRow);
      console.log("save : arrobjRow : ", this.arrobjRow);
      this.retailProductService
        .postRetailProductUpdate(dataJson)
        .subscribe(data => {
          this.router.navigate([this.retailerDetail, this.retailId]);
        });
    }
  }

  btnCancelClick() {
    const dialogRef = this.dialogService.open(DialogsCancelComponent, {});

    dialogRef.onClose.subscribe(result => {
      if (result === "cancel") {
      }
      if (result === "ok") {
        this.router.navigate([this.retailerDetail, this.retailId]);
      }
    });
  }

  btnBackClick() {
    const dialogRef = this.dialogService.open(DialogsCancelComponent, {});

    dialogRef.onClose.subscribe(result => {
      if (result === "cancel") {
      }
      if (result === "ok") {
        this.router.navigate([
          this.retailerProductDetail,
          this.retailId,
          this.RowID
        ]);
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
    console.log("uploadFile : this.imagePath : ", this.imagePath);
    reader.readAsDataURL(event[0]);
    reader.onload = _event => {
      this.imgURL = reader.result;
    };
    this.upload();
  }

  upload() {
    const dataJson = {
      type_id: 641,
      file_name: this.imagePath.name,
      file_type: this.imagePath.type,
      dealer_id: this.id_local,
      retail_id: 0
    };
    console.log("dataJson : ", dataJson);
    this.uploadAPIService.uploadImg(JSON.stringify(dataJson)).subscribe(res => {
      console.log(res);
      this.uploadData = res.response_data[0];

      this.uploadAPIService
        .uploadPut(this.uploadData.file_upload_url, this.imagePath)
        .subscribe(res1 => {
          console.log(res1);
          this.arrobjRow.product_image_url = this.uploadData.file_url;
          console.log(this.arrobjRow.retail_image_url);
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

  productWholesaleArray() {
    const self = this;
    const _function = {
      consoleLog(_function_name, _title, _data) {
        const _self = this;
        console.log(_function_name, " : ", _title, " : ", _data);
      },
      get(_wholesale, callback: (red) => any) {
        const _self = this;
        const wholesale = {
          product_discount: 0,
          discount:
            _wholesale.discount_percent !== 0 &&
            _wholesale.discount_percent !== "0"
              ? "discount_percent"
              : "discount_thb",
          product_wholesale: {
            qty_minimum: _wholesale.qty_minimum,
            product_price: _wholesale.product_price,
            discount_thb: _wholesale.discount_thb,
            discount_percent: _wholesale.discount_percent
          },
          status: {
            qty_minimum: false,
            product_price: false,
            discount_thb: false,
            discount_percent: false
          }
        };
        _self.consoleLog("add", "wholesale", wholesale);
        callback(wholesale);
      },
      add(callback: (red) => any) {
        const _self = this;
        const wholesale = {
          product_discount: 0,
          discount: "discount_thb",
          product_wholesale: {
            qty_minimum: 1,
            product_price: 0,
            discount_thb: 0,
            discount_percent: 0
          },
          status: {
            qty_minimum: false,
            product_price: false,
            discount_thb: false,
            discount_percent: false
          }
        };
        _self.consoleLog("add", "wholesale", wholesale);
        callback(wholesale);
      },
      push() {
        const _self = this;
        _self.add(red => {
          self.product_wholesale_array.push(red);
          _self.filterStatus();
          _self.consoleLog(
            "add",
            "this.product_wholesale_array",
            self.product_wholesale_array
          );
        });
      },
      remove(index, item) {
        const _self = this;
        _self.consoleLog("remove", "index", index);
        _self.consoleLog("remove", "item", item);

        const dialogRef = self.dialogService.open(DeleteComponent, {
          context: {
            icon: "people-outline",
            title: "Confirm Delete ?"
          }
        });
        dialogRef.onClose.subscribe(result => {
          if (result === "ok") {
            self.product_wholesale_array.splice(index, 1);
            _self.filterStatus();
          }
        });
      },
      update(index, object_values) {
        const _self = this;
        _self.consoleLog("update", "index", index);
        _self.consoleLog("update", "object_values", object_values);
        /* tslint:disable-next-line: forin */
        for (const key in self.product_wholesale_array[index]
          .product_wholesale) {
          if (
            self.product_wholesale_array[
              index
            ].product_wholesale.hasOwnProperty(key) &&
            object_values === key
          ) {
            const product_wholesale_key =
              self.product_wholesale_array[index].product_wholesale[key];
            _self.checkUndefined(product_wholesale_key, product_wholesale => {
              self.product_wholesale_array[index].product_wholesale[
                key
              ] = product_wholesale;
              _self.checkQtyMinimum(
                key,
                product_wholesale_key,
                product_wholesale_qty => {
                  self.product_wholesale_array[index].product_wholesale[
                    key
                  ] = product_wholesale_qty;
                  const product_price = parseFloat(
                    self.product_wholesale_array[index].product_wholesale[
                      "product_price"
                    ]
                  );
                  const discount_thb = parseFloat(
                    self.product_wholesale_array[index].product_wholesale[
                      "discount_thb"
                    ]
                  );
                  const discount_thb_default =
                    self.product_wholesale_array[index].product_wholesale[
                      "discount_thb"
                    ];
                  const discount_percent = parseFloat(
                    self.product_wholesale_array[index].product_wholesale[
                      "discount_percent"
                    ]
                  );
                  _self.calculate(
                    product_price,
                    discount_thb,
                    discount_percent,
                    (
                      red_product_price,
                      red_discount_thb,
                      red_discount_percent,
                      red_product_discount
                    ) => {
                      self.product_wholesale_array[index].product_wholesale[
                        "discount_thb"
                      ] =
                        product_price < discount_thb
                          ? red_discount_thb
                          : discount_thb_default;
                      self.product_wholesale_array[index].product_wholesale[
                        "discount_percent"
                      ] = red_discount_percent;
                      self.product_wholesale_array[index][
                        "product_discount"
                      ] = red_product_discount;
                      _self.filterStatus();
                    }
                  );
                }
              );
            });
          }
        }
        _self.consoleLog(
          "update",
          "self.product_wholesale_array[index];",
          self.product_wholesale_array[index]
        );
      },
      checkUndefined(
        product_wholesale_key,
        callback: (product_wholesale) => any
      ) {
        const _self = this;
        let product_wholesale = product_wholesale_key;
        if (
          product_wholesale_key === "" ||
          product_wholesale_key === undefined
        ) {
          product_wholesale = 0;
        }
        callback(product_wholesale);
      },
      checkQtyMinimum(
        key,
        product_wholesale_key,
        callback: (product_wholesale) => any
      ) {
        const _self = this;
        let product_wholesale = product_wholesale_key;
        if (
          (product_wholesale_key === "" ||
            product_wholesale_key === "0" ||
            product_wholesale_key === undefined ||
            product_wholesale_key === 0) &&
          key === "qty_minimum"
        ) {
          product_wholesale = 1;
        } else if (
          product_wholesale_key === "" ||
          product_wholesale_key === "0" ||
          product_wholesale_key === undefined ||
          product_wholesale_key === 0
        ) {
          product_wholesale = 0;
        }
        callback(product_wholesale);
      },
      filterStatus() {
        const _self = this;
        self.product_wholesale_array.map(
          (red_product_wholesale_array, index_product_wholesale_array) => {
            self.product_wholesale_array[
              index_product_wholesale_array
            ].status.qty_minimum = false;
            self.product_wholesale_array[
              index_product_wholesale_array
            ].status.product_price = false;
          }
        );
        let filter = self.product_wholesale_array.map((red, index) => {
          _self.consoleLog("checkQtyMinimum", "red", red);
          const product_price = red.product_wholesale.product_price;
          if (
            product_price === "0.00" ||
            product_price === "0" ||
            product_price === 0
          ) {
            self.product_wholesale_array[index].status.product_price = true;
          }
          return red.product_wholesale.qty_minimum;
        });
        filter = [
          ...new Set(
            filter.filter((item, index) => filter.indexOf(item) !== index)
          )
        ];
        _self.consoleLog("checkQtyMinimum", "filter", filter);
        self.product_wholesale_array.map(
          (red_product_wholesale_array, index_product_wholesale_array) => {
            filter.map((red_filter, index_filter) => {
              if (
                red_product_wholesale_array.product_wholesale.qty_minimum ===
                red_filter
              ) {
                self.product_wholesale_array[
                  index_product_wholesale_array
                ].status.qty_minimum = true;
              }
            });
          }
        );
      },
      onChange(index, event) {
        const _self = this;
        _self.consoleLog("onChange", "index", index);
        _self.consoleLog("onChange", "event", event);
        _self.consoleLog(
          "onChange",
          "self.product_wholesale_array[index];",
          self.product_wholesale_array[index]
        );
        /* tslint:disable-next-line: forin */
        for (const key in self.product_wholesale_array[index]
          .product_wholesale) {
          if (
            self.product_wholesale_array[
              index
            ].product_wholesale.hasOwnProperty(key) &&
            event === key
          ) {
            self.product_wholesale_array[index].product_wholesale[key] = 0;
            self.product_wholesale_array[index].product_wholesale[
              key === "discount_thb" ? "discount_percent" : "discount_thb"
            ] = 0;
          }
          const product_price = parseFloat(
            self.product_wholesale_array[index].product_wholesale[
              "product_price"
            ]
          );
          const discount_thb = parseFloat(
            self.product_wholesale_array[index].product_wholesale[
              "discount_thb"
            ]
          );
          const discount_percent = parseFloat(
            self.product_wholesale_array[index].product_wholesale[
              "discount_percent"
            ]
          );
          _self.calculate(
            product_price,
            discount_thb,
            discount_percent,
            (
              red_product_price,
              red_discount_thb,
              red_discount_percent,
              red_product_discount
            ) => {
              self.product_wholesale_array[index].product_wholesale[
                "discount_thb"
              ] = red_discount_thb;
              self.product_wholesale_array[index].product_wholesale[
                "discount_percent"
              ] = red_discount_percent;
              self.product_wholesale_array[index][
                "product_discount"
              ] = red_product_discount;
            }
          );
        }
        _self.consoleLog(
          "onChange",
          "self.product_wholesale_array[index];",
          self.product_wholesale_array[index]
        );
      },
      calculate(
        product_price,
        discount_thb,
        discount_percent,
        callback: (
          product_price,
          discount_thb,
          discount_percent,
          product_discount
        ) => any
      ) {
        const _self = this;
        let product_discount = 0;
        if (product_price < discount_thb) {
          discount_thb = product_price - 1;
        }
        if (discount_percent >= 99) {
          discount_percent = 99;
        }
        if (product_price === 0) {
          discount_thb = 0;
          discount_percent = 0;
        }
        product_discount =
          discount_thb !== 0
            ? product_price - discount_thb
            : product_price - (product_price * discount_percent) / 100;
        callback(
          product_price,
          discount_thb,
          discount_percent,
          product_discount
        );
      }
    };
    return _function;
  }
}
