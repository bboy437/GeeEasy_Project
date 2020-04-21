import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { NgbdSortableHeader, SortEvent, WarehouseAPIService, UploadAPIService } from '@project/services';
import { CheckinAPIService } from '@project/services';
import { NbDialogService } from '@nebular/theme';
import { DialogSuccessComponent } from '../../dialogs/dialog-success/dialog-success.component';
import { DialogsImageComponent } from '../../dialogs/dialogs-image/dialogs-image.component';
import { DialogsCancelComponent } from '../../dialogs/dialogs-cancel/dialogs-cancel.component';
import { AleartComponent } from '../../dialogs/aleart/aleart.component';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import JSON_PROVINCE from "../../../../../../libs/shared/src/lib/json/province.json";
import JSON_LOCATION from "../../../../../../libs/shared/src/lib/json/location.json";
import JSON_LOCATION_DETAIL from "../../../../../../libs/shared/src/lib/json/location_detail.json";
import JSON_CURRENCY from "../../../../../../libs/shared/src/lib/json/currency.json";

@Component({
  selector: 'project-check-in-detail',
  templateUrl: './check-in-detail.component.html',
  styleUrls: ['./check-in-detail.component.scss'],
})
export class CheckInDetailComponent implements OnInit {

  DateSelected = new Date();
  private UrlRouter_CheckInCancel = "check-in/list";
  arrobjRow: any = [];
  arrCheckInFilter: any = [];
  arrWhereHouse: any = [];
  arrWhereHouseFilter: any = [];
  arrWarehouse: any = [];
  filterValue: any = [];
  arrUnitWH = [{ unit_name: "cm" }];
  arrUnitWeight = [{ unit_name: "kg" }];
  RowID: string;
  status: string;
  checked = false;
  ischecked = false;
  strWarehouseID: string;
  test: any = [];
  loading = false;
  strFillter: string;
  checkedAll: boolean;
  image_array: any = [];
  isProduct = false;
  isSaveProduct = false;
  submitted = false;
  id_local: string;
  arrCheckIn: any = [];
  product_manual_json: any = [];
  arrCountry: any[];
  arrLocation: any[] = JSON_LOCATION;
  arrLocationDetail: any[] = JSON_LOCATION_DETAIL;
  arrCurrency: any[] = JSON_CURRENCY;


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

  productForm: FormGroup;
  checkinForm: FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private checkinAPIService: CheckinAPIService,
    private dialogService: NbDialogService,
    private warehouseAPIService: WarehouseAPIService,
    private formBuilder: FormBuilder,
    private uploadAPIService: UploadAPIService
  ) {
    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);

    this.loading = true;
  }

  ngOnInit() {
    this.buildFormCheckIn();
    const params = this.route.snapshot.paramMap;
    this.RowID = params.get("id");
    this.status = params.get("status");
    console.log(this.status);
    if (this.RowID) {
      this.getData();
    }
    this.get_Country(0);
    // this.buildForm();
  }

  buildFormCheckIn() {
    this.checkinForm = this.formBuilder.group({
      checkin: this.formBuilder.array([])
    });
  }

  get checkin(): FormArray {
    return this.checkinForm.get('checkin') as FormArray;
  }

  getData() {
    this.checkinAPIService.getCheckdetail(this.RowID).subscribe(data => {
      console.log(data);
      this.arrobjRow = data.response_data[0];
      this.arrCheckIn = data.response_data[0].purchase_order_product_array;
      this.arrWhereHouse = data.response_data[0].warehouse_data;
      this.arrCheckIn.forEach(element => {
        if (this.arrWhereHouse.length > 0) {
          element.warehouse_name = this.arrWhereHouse[0].warehouse_name;
          element.warehouse_id = this.arrWhereHouse[0].warehouse_id;
        }
        element.checkin_qty = 0;
        element.incomingSum = (element.checkin_data.incoming - element.checkin_data_exist.onhand) < 0 ? 0 : element.checkin_data.incoming - element.checkin_data_exist.onhand;
        // element.onhandSum = element.checkin_data.onhand + element.checkin_data.onhand_manual + element.checkin_data_exist.onhand + element.checkin_data_exist.onhand_manual;
        element.onhandSum = element.checkin_data_exist.onhand;
        element.availableSum = element.checkin_data_exist.onhand - element.checkin_data.outgoing;
        element.note = "";
        element.image_array = "";
        element.product_manual_json = [];


      });
      this.getWarehouse();
      this.arrCheckInFilter = this.arrCheckIn;
      this.filterValue = this.arrCheckIn;

      console.log(this.arrCheckIn);
      console.log(this.arrCheckInFilter);

      this.setCheckin();

    })
  }

  setCheckin() {
    this.arrCheckIn.forEach(element => {
      this.checkin.push(
        this.formBuilder.group(element)
      );
    });
    console.log('checkin', this.checkin);
    this.loading = false;
  }

  getWarehouse() {
    const value = "distributor_id=" + this.id_local + "&warehouse_type_id=" + 2
    this.warehouseAPIService.getWarehouseList(value).subscribe(data => {
      this.arrWarehouse = data.response_data;
      this.arrCheckIn.forEach(element => {
        this.arrWarehouse.forEach(ware => {
          if (element.warehouse_name === ware.warehouse_name) {
            element.warehouse_id = ware.warehouse_id;
          }
        });
      });
    })
  }

  setData(value: any) {
    const warehouseName = value
    this.arrCheckIn.forEach(element => {
      element.warehouse_name = warehouseName;
    });
    this.arrCheckInFilter.forEach(element => {
      element.warehouse_name = warehouseName;
    });

  }

  checkQty(value, data: any) {
    console.log('value', value);
    console.log('data', data);
    // tslint:disable-next-line: triple-equals
    if (data.value.checkin_qty > data.value.incomingSum || data.value.checkin_qty <= 0 || value == "-" || value == "") {
      const dialogRef = this.dialogService.open(AleartComponent, {
        context: {
          status: 'checkin',
        },
      });
      dialogRef.onClose.subscribe(result => {
        if (result === 'ok') {
          data.value.checkin_qty = 0;
          const array = this.checkinForm.controls.checkin.value
          this.checkinForm.controls.checkin.patchValue(array)
        }
      });
    }

  }

  filterData(value: any) {
    this.arrCheckIn = this.arrCheckInFilter.filter(option =>
      option.request_product_name.toLowerCase().toString().includes(value) ||
      option.request_product_sku.toLowerCase().toString().includes(value)
    )

    return this.arrCheckIn.filter(option =>
      option.request_product_name.toLowerCase().toString().includes(value) ||
      option.request_product_sku.toLowerCase().toString().includes(value)
    )

  }

  refresh() {
    this.strFillter = "";
    this.arrCheckIn = this.filterValue;
  }

  warehouseID(value, data) {
    console.log(value);
    console.log(this.arrCheckIn);
    this.allCheckInActive(this.arrCheckIn, res => {
      this.checkedAll = res;
      console.log(this.checkedAll);

    });

  }

  allCheckInActive(checkIn, callbacl) {
    let status = true;
    checkIn.forEach(item => {
      if (item.warehouse_id === "0")
        status = false;
    });
    callbacl(status);
  }

  toggle(checked: boolean, data: any, i) {
    console.log(checked, data, i);
    this.ischecked = false;
    if (checked === true) {
      this.test.push(data);
    } else {
      this.test.splice(i, 1);
    }

    console.log(this.test);
  }

  btncheckAll() {
    const dataCheckIn: any = [];
    const data: any = [];
    for (let index = 0; index < this.checkin.value.length; index++) {

      dataCheckIn.push({
        product_id: this.checkin.value[index].confirm_product_id,
        available: this.checkin.value[index].checkin_data.available,
        change: this.checkin.value[index].checkin_data.change,
        onhand: this.checkin.value[index].checkin_data.onhand,
        outgoing: this.checkin.value[index].checkin_data.outgoing,
        incoming: this.checkin.value[index].checkin_data.incoming,
        warehouse_id: this.checkin.value[index].warehouse_id,
        note: this.checkin.value[index].note === undefined || "" ? "-" : this.checkin.value[index].note,
        image_array: this.checkin.value[index].image_array === undefined || "" ? [] : this.checkin.value[index].image_array
      })
    }
    data.purchase_order_id = this.arrobjRow.purchase_order_id;
    data.confirm_id = 1;
    data.product_json = dataCheckIn;
    data.status = 0;
    data.product_manual_json = this.product_manual_json;
    this.btnCheckInClick([], data);
  }

  btncheckInPartial(data) {
    console.log(data);

    if (data.checkin_qty === 0 || data.checkin_qty === null) {
      const dialogRef = this.dialogService.open(AleartComponent, {
        context: {
          status: 'checkin',
        },
      });
      dialogRef.onClose.subscribe(result => {
        if (result === 'ok') {
          data.checkin_qty = 0;
        }
      });
    } else {
      const dataJson = {
        status: 1,
        purchase_order_id: this.arrobjRow.purchase_order_id,
        product_id: data.confirm_product_id,
        checkin_qty: data.checkin_qty,
        warehouse_id: data.warehouse_id,
        note: data.note === undefined || "" ? "-" : data.note,
        image_array: data.image_array === undefined || "" ? [] : data.image_array,
        product_manual_json: this.product_manual_json,
      }
      this.btnCheckInClick(data, dataJson);
    }

  }

  btnCheckInClick(data: any, dataJson: any): void {

    const dialogRef = this.dialogService.open(DialogSuccessComponent, {
      context: {
        data: dataJson,
        status: "checkin"
      },
    });
    dialogRef.onClose.subscribe(result => {

      if (result === 'ok') {
        if (this.status == '0') {
          this.router.navigate([this.UrlRouter_CheckInCancel]);
        } else {
          data.incomingSum = (data.incomingSum - data.checkin_qty) < 0 ? 0 : (data.incomingSum - data.checkin_qty);
          data.onhandSum = (data.onhandSum + data.checkin_qty);
          data.availableSum = (data.onhandSum - data.checkin_data.outgoing);
          data.checkin_qty = 0;
          data.note = "";
          data.image_array = "";
          // this.getData();
          console.log(data, dataJson);
        }
      }
    });
  }

  btnCancelClick() {
    const dialogRef = this.dialogService.open(DialogsCancelComponent, {
    });

    dialogRef.onClose.subscribe(result => {
      if (result === 'cancel') {
      }
      if (result === 'ok') {
        this.router.navigate([this.UrlRouter_CheckInCancel]);
      }
    });
  }

  btnNoteClick(data) {
    const dialogRef = this.dialogService.open(DialogSuccessComponent, {
      context: {
        data: data.value,
        status: "add-note"
      },
    });
    dialogRef.onClose.subscribe(result => {
      console.log('result', result);
      if (result !== "") {
        data.value.note = result;
        console.log('checkin', this.checkin);
        const array = this.checkinForm.controls.checkin.value
        this.checkinForm.controls.checkin.patchValue(array)
      }
    });

  }

  btnImageClick(data) {
    console.log('data', data);
    const dialogRef = this.dialogService.open(DialogSuccessComponent, {
      context: {
        data: data.value,
        status: "add-img"
      },
    });
    dialogRef.onClose.subscribe(result => {
      console.log('result', result);
      if (result !== "") {
        data.value.image_array = result;
        console.log('checkin', this.checkin);
        const array = this.checkinForm.controls.checkin.value
        this.checkinForm.controls.checkin.patchValue(array)
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

  sum(value: any, product_id) {
    const productID = product_id;
    const productvalue = value;
    const CheckIn = this.arrCheckIn;

    if (CheckIn.length > 0) {
      for (let i = 0; i < CheckIn.length; i++) {
        if (CheckIn[i].confirm_product_id === productID) {

          // const data = CheckIn[i].checkin_data.checkin_onhand - CheckIn[i].checkin_data.checkin_outgoing;
          // console.log(data);


        }
      }
    }
  }

  keyDown(e) {
    console.log(e);
    // tslint:disable-next-line: triple-equals
    if (e.key == "-" || e.key == 0) {
      return false;
    }
  }

  addProduct() {
    this.isProduct = true;
    this.buildForm();
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

  get f() {
    return this.productForm.controls;
  }

  buildForm() {
    this.productForm = this.formBuilder.group({
      product_title: ["", Validators.required],
      product_sku: ["", Validators.required],
      product_price: ["", Validators.required],
      qty: ["", Validators.required],
      warehouse_id: ["", Validators.required],
      warehouse_name: [],
      note: ["", Validators.required],
      product_unit: ["", Validators.required],
      product_currency_code: ["", Validators.required],
      product_country: ["", Validators.required],
      width: ["", Validators.required],
      width_unit: ["", Validators.required],
      height: ["", Validators.required],
      height_unit: ["", Validators.required],
      weight: ["", Validators.required],
      weight_unit: ["", Validators.required],
    });
    this.productForm.get("product_country").patchValue("Thailand");
    this.productForm.get("width_unit").patchValue("cm");
    this.productForm.get("height_unit").patchValue("cm");
    this.productForm.get("weight_unit").patchValue("kg");
    this.productForm.get("product_currency_code").patchValue("THB");
  }

  btnIDClick(options) {
    console.log(options);
    if (options.length > 0) {
      this.productForm.get("warehouse_name").patchValue(options[0].data.warehouse_name)
    }

  }

  onKeyQuantity(searchValue): void {
    console.log("searchValue", searchValue);
    if (searchValue <= 0 || searchValue === "") {
      const dialogRef = this.dialogService.open(AleartComponent, {
        context: {
          status: "Quantity"
        }
      });
      dialogRef.onClose.subscribe(result => {
        if (result === "ok") {
          this.productForm.get("qty").patchValue(1);
        }
      });
    }
  }

  btnCancel() {
    this.productForm.reset();
    this.product.main_image.port = [];
    this.product.main_image.get = [];
    this.product.product_image_array.port = [];
    this.product.product_image_array.get = [];
    this.submitted = false;
    this.isProduct = false;
  }

  btnSave() {

    this.productForm.get("product_title").patchValue(this.productForm.value.product_title.replace(/[^\u0E00-\u0E7Fa-zA-Z_0-9 \.\-\(\)\&]/g, ""));
    this.productForm.get("product_sku").patchValue(this.productForm.value.product_sku.replace(/[^a-zA-Z_0-9 \.\-]/g, ""));
    this.productForm.get("product_unit").patchValue(this.productForm.value.product_unit.replace(/[^\u0E00-\u0E7Fa-zA-Z \.\-]/g, ""));
    console.log(this.productForm.value);

    this.submitted = true;
    if (this.productForm.invalid) {
      return;
    }
    this.isSaveProduct = true;
    this.product.update = true;
    const dataSend = {
      type_id: 120,
      file_name: "",
      file_type: "",
      distributor_id: this.id_local,
      user_id: 0
    };

    this.uploadAPIService.uploadImage().getImageArray(dataSend, this.product.main_image.get,
      red_image_array => {
        console.log("btnSaveClick : red_image_array : ", red_image_array);
        this.product.main_image.port = red_image_array;
        this.uploadAPIService.uploadImage().getImageArray(dataSend, this.product.product_image_array.get,
          red_product_image_array => {
            console.log("btnSaveClick : red_product_image_array : ", red_product_image_array);
            this.product.product_image_array.port = red_product_image_array;
            this.save();
          }
        );
      }
    );


  }

  save() {
    const dataJson = {
      product_image_url:
        this.product.main_image.port.length > 0
          ? this.product.main_image.port[0].image_url
          : "-",
      product_title: this.productForm.value.product_title,
      product_sku: this.productForm.value.product_sku,
      warehouse_id: +this.productForm.value.warehouse_id,
      warehouse_name: this.productForm.value.warehouse_name,
      qty: +this.productForm.value.qty,
      product_price: +this.productForm.value.product_price,
      note: this.productForm.value.note,
      product_unit: this.productForm.value.product_unit,
      product_currency_code: this.productForm.value.product_currency_code,
      product_country: this.productForm.value.product_country,
      image_array: this.product.product_image_array.port,
      product_attribute: {
        weight: +this.productForm.value.weight,
        weight_unit: this.productForm.value.weight_unit,
        height: +this.productForm.value.height,
        height_unit: this.productForm.value.height_unit,
        width: +this.productForm.value.width,
        width_unit: this.productForm.value.width_unit,
      }
    };

    this.isSaveProduct = false;

    this.product_manual_json.push(dataJson);
    this.productForm.reset();
    this.product.main_image.port = [];
    this.product.main_image.get = [];
    this.product.product_image_array.port = [];
    this.product.product_image_array.get = [];
    this.isProduct = false;
    this.submitted = false;
    console.log('dataJson, ', dataJson);
    console.log('product_manual_json', this.product_manual_json);
    console.log('product', this.product);
  }

  btnDeleteProduct(i) {
    this.product_manual_json.splice(i, 1);
  }


}
