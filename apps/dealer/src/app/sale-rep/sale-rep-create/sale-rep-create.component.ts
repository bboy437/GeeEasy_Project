import { Router, ActivatedRoute } from "@angular/router";
import {
  UploadAPIService,
  BrowseSupplierAPIService,
  SaleRepService
} from "@project/services";
import { LocationAPIService } from "@project/services";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from "@angular/forms";
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone
} from "@angular/core";
import { NbDialogService } from "@nebular/theme";
import { DialogsMapComponent } from "../../dialogs/dialogs-map/dialogs-map.component";
import { DialogsCancelComponent } from "../../dialogs/dialogs-cancel/dialogs-cancel.component";
import axios from "axios";
import { count } from 'rxjs/operators';

@Component({
  selector: "project-sale-rep-create",
  templateUrl: "./sale-rep-create.component.html",
  styleUrls: ["./sale-rep-create.component.scss"]
})

export class SaleRepCreateComponent implements OnInit {
  private listPage = "sale-rep/list";
  private detailPage = "sale-rep/detail";

  arrobjRow: any = {};
  objAPIResponse: any = {};
  RowID: string;
  SaleForm: FormGroup;
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

  phone: any = {
    tel: {
      input: "",
      number: "",
      number_array: []
    },
    mobile: {
      input: "",
      number: "",
      number_array: []
    },
  }

  id_local: string;


  constructor(
    private router: Router,
    private locationService: LocationAPIService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private dialogService: NbDialogService,
    private uploadAPIService: UploadAPIService,
    private browseSupplierAPIService: BrowseSupplierAPIService, private saleRepService: SaleRepService
  ) {
    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);
    this.loading = true;
  }

  ngOnInit() {
    this.buildForm();
    const params = this.route.snapshot.paramMap;
    this.RowID = params.get("id");
    if (this.RowID === "new") {
      this.getCountryNew();
      this.getCategory();
      this.loading = false;
    } else {


      this.getSalerepAccountDetail(res => {
        console.log("ngOnInit : getSalerepAccountDetail : res : ", res);
        this.arrobjRow = res.response_data[0];
        console.log("ngOnInit : res : ", res);
        this.imgURL = res.response_data[0].sale_rep_image_url;
        this.getStateEdit();
        this.phoneNumber().main(_self_ => {
          res.response_data.forEach(item => {
            _self_.getNumberArray(item.sale_rep_tel, getNumberArray => {
              this.phone.tel.number = item.sale_rep_tel;
              this.phone.tel.number_array = getNumberArray;
            });
            _self_.getNumberArray(item.sale_rep_mobile, getNumberArray => {
              this.phone.mobile.number = item.sale_rep_mobile;
              this.phone.mobile.number_array = getNumberArray;
            });
          });
        });
        this.loading = false;
      })
      // this.distributorAPIService.getDisDetail(this.RowID).subscribe(data => {
      //   this.arrobjRow = data.response_data[0];
      //   this.imgURL = data.response_data[0].sale_rep_image_url;
      //   this.getStateEdit();
      //   this.getCategory();
      //   console.log(this.arrobjRow);

      //   console.log("ngOnInit : data : ", data);
      //   this.phoneNumber().main(_self_ => {
      //     data.response_data.forEach(item => {
      //       _self_.getNumberArray(item.sale_rep_tel, getNumberArray => {
      //         this.phone.tel.number = item.sale_rep_tel;
      //         this.phone.tel.number_array = getNumberArray;
      //       });
      //       _self_.getNumberArray(item.sale_rep_mobile, getNumberArray => {
      //         this.phone.mobile.number = item.sale_rep_mobile;
      //         this.phone.mobile.number_array = getNumberArray;
      //       });
      //     });
      //   });


      //   this.loading = false;
      // });
    }
  }

  getSalerepAccountDetail(callback: (res) => any) {
    const params = this.route.snapshot.paramMap;
    this.RowID = params.get("id");
    this.saleRepService.getSalerepAccountDetail(this.RowID).subscribe(res => {
      console.log("getSalerepAccountDetail : res : ", res);
      callback(res);
    })
  };

  getCategory() {
    const valueCategory = "cur_page=" + 1 + "&per_page=" + 10;
    this.browseSupplierAPIService
      .getCategoryDist(valueCategory)
      .subscribe(data => {
        this.arrCategory = data.response_data;
        this.product_category_id = this.arrobjRow.product_category_id;
      });
  }

  get f() {
    return this.SaleForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    if (this.SaleForm.invalid) {
      return;
    }
  }

  buildForm() {
    this.SaleForm = this.formBuilder.group({
      salename: ["", Validators.required],
      salerepcompany : ["", Validators.required],
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      emailAddress: ["", [Validators.required, Validators.email]],
      telephoneNumber: [""],
      Address: ["", Validators.required],
      number: ["", Validators.required],
      zipcode: ["", Validators.required],
      saletag: ["", Validators.required]
    });
    // phoneNo: ["", Validators.required],
    // phoneNumber: ["", Validators.required],
    // telephoneNumber: ["", Validators.required],
    // mobilePhoneNumber: ["", Validators.required],
  }

  // New ----------------------------------------------------------

  getCountryNew() {
    //getState
    const dataState =
      "txt_location_type_id=" +
      2 +
      "&txt_parent_id=" +
      231 +
      "&cur_page=" +
      1 +
      "&per_page=" +
      100;
    this.locationService.get(dataState).subscribe(data => {
      this.arrobjState = data.data.dataList;
    });
  }
  getStateNew(event: any) {
    this.isValidatorsstate = "";
    this.strCity = "";
    this.strTown = "";
    this.strZipcode = "";
    this.arrobjCity = null;
    this.arrobjTown = null;
    if (this.arrobjState.length > 0) {
      for (let i = 0; i < this.arrobjState.length; i++) {
        if (this.arrobjState[i].location_name === event) {
          const parentID = this.arrobjState[i].location_id;
          this.arrobjRow.sale_rep_addr_province = this.arrobjState[
            i
          ].location_name;
          //getCity
          const dataCity =
            "txt_location_type_id=" +
            3 +
            "&txt_parent_id=" +
            parentID +
            "&cur_page=" +
            1 +
            "&per_page=" +
            100;
          this.locationService.get(dataCity).subscribe(data => {
            this.arrobjCity = data.data.dataList;
          });
        }
      }
    }
  }
  getCityNew(event: any) {
    this.isValidatorsCity = "";
    this.strTown = "";
    this.strZipcode = "";
    this.arrobjTown = null;
    if (this.arrobjCity.length > 0) {
      for (let i = 0; i < this.arrobjCity.length; i++) {
        if (this.arrobjCity[i].location_name === event) {
          const parentID = this.arrobjCity[i].location_id;
          this.arrobjRow.sale_rep_addr_amphoe = this.arrobjCity[
            i
          ].location_name;
          //getCity
          const dataTown =
            "txt_location_type_id=" +
            4 +
            "&txt_parent_id=" +
            parentID +
            "&cur_page=" +
            1 +
            "&per_page=" +
            100;
          this.locationService.get(dataTown).subscribe(data => {
            this.arrobjTown = data.data.dataList;
            console.log(this.arrobjTown);
          });
        }
      }
    }
  }
  getTownNew(event: any) {
    this.isValidatorsTown = "";
    if (this.arrobjTown.length > 0) {
      for (let i = 0; i < this.arrobjTown.length; i++) {
        if (this.arrobjTown[i].location_name === event) {
          this.strZipcode = this.arrobjTown[i].location_postcode;
          this.arrobjRow.sale_rep_addr_tambon = this.arrobjTown[
            i
          ].location_name;
          this.arrobjRow.sale_rep_addr_post = this.arrobjTown[
            i
          ].location_postcode;
        }
      }
    }
  }

  //edit --------------------------------------------

  getStateEdit() {
    const dataState =
      "txt_location_type_id=" +
      2 +
      "&txt_parent_id=" +
      231 +
      "&cur_page=" +
      1 +
      "&per_page=" +
      100;
    this.locationService.get(dataState).subscribe(data => {
      this.arrobjState = data.data.dataList;
      this.strState = this.arrobjRow.sale_rep_addr_province;
      this.getCityEdit(
        this.arrobjRow.sale_rep_addr_province,
        this.arrobjState
      );
    });
  }
  getCityEdit(str: string, arrstate: any) {
    const strs = str;
    const arrstates = arrstate;
    if (arrstates.length > 0) {
      for (let i = 0; i < arrstates.length; i++) {
        if (arrstates[i].location_name === strs) {
          const parentID = arrstates[i].location_id;
          //getCity
          const dataCity =
            "txt_location_type_id=" +
            3 +
            "&txt_parent_id=" +
            parentID +
            "&cur_page=" +
            1 +
            "&per_page=" +
            100;
          this.locationService.get(dataCity).subscribe(data => {
            this.arrobjCity = data.data.dataList;
            this.strCity = this.arrobjRow.sale_rep_addr_amphoe;
            this.getTownEdit(
              this.arrobjRow.sale_rep_addr_amphoe,
              this.arrobjCity
            );
          });
        }
      }
    }
  }
  getTownEdit(str: string, arrcity: any) {
    const strs = str;
    const arrcitys = arrcity;
    if (arrcitys.length > 0) {
      for (let i = 0; i < arrcitys.length; i++) {
        if (arrcitys[i].location_name === strs) {
          const parentID = arrcitys[i].location_id;

          //  this.arrobjRow.supplier_addr_post = arrcitys[i].location_name;
          //getTown
          const dataTown =
            "txt_location_type_id=" +
            4 +
            "&txt_parent_id=" +
            parentID +
            "&cur_page=" +
            1 +
            "&per_page=" +
            100;
          this.locationService.get(dataTown).subscribe(data => {
            this.arrobjTown = data.data.dataList;
            this.strTown = this.arrobjRow.sale_rep_addr_tambon;
            this.strZipcode = this.arrobjRow.sale_rep_addr_post;
            this.getSave();
          });
        }
      }
    }
  }
  //--------------------------------------------

  getSave() {
    this.arrobjRow.sale_rep_addr_province = this.strState;
    this.arrobjRow.sale_rep_addr_amphoe = this.strCity;
    this.arrobjRow.sale_rep_addr_tambon = this.strTown;
    this.arrobjRow.sale_rep_addr_post = this.strZipcode;
  }

  btnDialogMab() {
    const dialogRef = this.dialogService.open(DialogsMapComponent, {});

    dialogRef.onClose.subscribe(result => {
      console.log("btnDialogMab : result : ", result);
      if (result) {
        this.isValidatorsstate = "";
        this.isValidatorsTown = "";
        this.isValidatorsCity = "";
        this.strCity = "";
        this.strTown = "";
        this.strZipcode = "";
        this.arrobjRow.supplier_addr_full = "";
        this.arrobjRow.supplier_addr_number = "";
        this.arrobjCity = null;
        this.arrobjTown = null;

        this.arrobjRow.sale_rep_addr_full = result.address;
        this.arrobjRow.sale_rep_addr_number = result.num;
        this.arrobjRow.sale_rep_addr_tambon = result.town;
        this.arrobjRow.sale_rep_addr_amphoe = result.city;
        this.arrobjRow.sale_rep_addr_province = result.state;
        this.arrobjRow.sale_rep_addr_post = result.zipcode;
        this.arrobjRow.sale_rep_addr_lat = result.supplier_addr_location_lat;
        this.arrobjRow.sale_rep_addr_lng = result.supplier_addr_location_lng;
        this.getStateEdit();
      }
    });
  }

  btnSaveClick() {
    if (this.strState === "") {
      this.isValidatorsstate = "no";
    }
    if (this.strCity === "") {
      this.isValidatorsCity = "no";
    }
    if (this.strTown === "") {
      this.isValidatorsTown = "no";
    }

    let phone = {
      tel: {
        target: {
          value: this.phone.tel.input
        }
      },
      mobile: {
        target: {
          value: this.phone.mobile.input
        }
      }
    }
    this.onInArrayPhone(9, 19, phone.tel, this.phone.tel);
    this.inArrayPhone(12, 12, phone.mobile, this.phone.mobile)

    console.log('btnSaveClick : SaleForm : ', this.SaleForm);
    this.submitted = true;
    if (this.SaleForm.invalid || this.strState === "" || this.strCity === "" || this.strTown === "" || this.phone.tel.number === "" || this.phone.mobile.number === "") {
      return;
    }
    this.save();
  }

  save() {
    if (this.RowID === "new") {
      this.arrobjRow.dealer_id = this.id_local;
      this.arrobjRow.sale_rep_id = 0;
      this.arrobjRow.sale_rep_image_url = this.arrobjRow.sale_rep_image_url;
      this.arrobjRow.sale_rep_addr_tambon = this.strTown;
      this.arrobjRow.sale_rep_addr_amphoe = this.strCity;
      this.arrobjRow.sale_rep_addr_province = this.strState;
      this.arrobjRow.sale_rep_addr_post = this.strZipcode;
      this.arrobjRow.sale_rep_mobile = this.phone.mobile.number;
      this.arrobjRow.sale_rep_tel = this.phone.tel.number;
      const dataJson = JSON.stringify(this.arrobjRow);
      console.log("save : dataJson : ", dataJson);
      // this.distributorAPIService.addDistributor(dataJson).subscribe(data => {
      //   this.router.navigate([this.listPage]);
      // })
      this.saleRepService.postSalerepAccountCreate(dataJson).subscribe(data => {
        this.router.navigate([this.listPage]);
      });
    } else {
      this.arrobjRow.sale_rep_id = this.arrobjRow.sale_rep_id;
      this.arrobjRow.sale_rep_image_url = this.arrobjRow.sale_rep_image_url;
      this.arrobjRow.sale_rep_addr_tambon = this.strTown;
      this.arrobjRow.sale_rep_addr_amphoe = this.strCity;
      this.arrobjRow.sale_rep_addr_province = this.strState;
      this.arrobjRow.sale_rep_addr_post = this.strZipcode;
      this.arrobjRow.sale_rep_mobile = this.phone.mobile.number;
      this.arrobjRow.sale_rep_tel = this.phone.tel.number;
      const dataJson = JSON.stringify(this.arrobjRow);
      console.log("save : arrobjRow : ", this.arrobjRow);

      this.saleRepService.postSalerepAccountUpdate(dataJson).subscribe(data => {
        this.router.navigate([this.listPage]);
      });

      // this.distributorAPIService.updateDistributor(dataJson).subscribe(data => {
      //   this.router.navigate([this.UrlRouter_DistributorsList]);
      // });
    }
  }

  btnCancelClick() {
    const dialogRef = this.dialogService.open(DialogsCancelComponent, {});

    dialogRef.onClose.subscribe(result => {
      if (result === "cancel") {
      }
      if (result === "ok") {
        this.router.navigate([this.listPage]);
      }
    });
  }

  btnBackClick() {
    const dialogRef = this.dialogService.open(DialogsCancelComponent, {});

    dialogRef.onClose.subscribe(result => {
      if (result === "cancel") {
      }
      if (result === "ok") {
        this.router.navigate([this.detailPage, this.RowID]);
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
      type_id: 100,
      file_name: this.imagePath.name,
      file_type: this.imagePath.type,
      dealer_id: this.id_local,
      sale_rep_id: 0
    };

    this.uploadAPIService.uploadImg(JSON.stringify(dataJson)).subscribe(res => {
      console.log(res);
      this.uploadData = res.response_data[0];

      this.uploadAPIService
        .uploadPut(this.uploadData.file_upload_url, this.imagePath)
        .subscribe(res1 => {
          console.log(res1);
          this.arrobjRow.sale_rep_image_url = this.uploadData.file_url;
          console.log(this.arrobjRow.sale_rep_image_url);
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


  phoneNumber() {
    let function_phone = {
      consoleLog(_function_, _title_, _data_) {
        let _self_ = this;
        console.log(_function_, " : ", _title_, " : ", _data_);
      },
      checkLength(_min_length_, _max_length_, _phone_, callback: (res) => any) {
        let _self_ = this;
        const res = ((_min_length_ <= _phone_) && (_phone_ <= _max_length_ || _phone_ > _max_length_));
        console.log("checkLength : _min_length_ <= _phone_ ", _min_length_ <= _phone_);
        console.log("checkLength :  _phone_ <= _max_length_ ", _phone_ <= _max_length_);
        callback(res);
      },
      checkIncludes(_phone_, _new_phone_, callback: (res) => any) {
        let _self_ = this;
        const res = _phone_.includes(_new_phone_);
        callback(res);
      },
      newNumber(checkLength, _phone_, _new_phone_, callback: (res) => any) {
        let _self_ = this;
        const res = (!checkLength) ? (_phone_ != "") ? ",".concat(_new_phone_) : _new_phone_ : "";
        callback(res)
      },
      getNumberArray(_phone_, callback: (res) => any) {
        let _self_ = this;
        const res = (_phone_ !== '')?_phone_.split(","):"";
        callback(res)
      },
      removeNumberIndex(index, _phone_array_, callback: (res) => any) {
        let _self_ = this;
        const res = _phone_array_.splice(index, 1);
        callback(res)
      },
      getNumber(_phone_array_, callback: (res) => any) {
        let _self_ = this;
        let res = "";
        _phone_array_.forEach(item => {
          _self_.newNumber(false, res, item, newNumber => {
            res = res.concat(newNumber);
          });
        });
        callback(res)
      },
      replaceString(_replace_, _new_replace_, _phone_, callback: (res) => any) {
        let _self_ = this;
        let res = _phone_.replace(_replace_, _new_replace_);
        callback(res);
      },
      matchString(_match_, _phone_, callback: (res) => any) {
        let _self_ = this;
        let res = (_phone_.match(_match_)) ? true : false;
        callback(res);
      },
      main(callback: (res) => any) {
        let _self_ = this;
        callback(_self_);
      }
    }
    return function_phone;
  }

  onInput(_min_, _max_, _event_, _phone_) {
    this.phoneNumber().main(_self_ => {
      _phone_.input = _event_.target.value;
      _self_.checkLength(_min_, _max_, _event_.target.value.length, checkLength => {
        if (checkLength) {
          _self_.matchString(/^\(?([0-9]{1,4})\)?[-. ]?([0-9]{1,4})[-. ]?([0-9]{1,4})[-. ]?([0-9]{1,4})$/, _event_.target.value, matchString => {
            console.log("onInput : matchString : ", matchString);
            if (matchString)
              _self_.checkIncludes(_phone_.number, _event_.target.value, checkIncludes => {
                _self_.newNumber(checkIncludes, _phone_.number, _event_.target.value, newNumber => {
                  _phone_.number = _phone_.number.concat(newNumber);
                  _self_.getNumberArray(_phone_.number, getNumberArray => {
                    _phone_.number_array = getNumberArray;
                  });
                });
              });
            _phone_.input = "";
            _event_.target.value = "";
          });
        }
      });
    });
  };

  onInArrayPhone(_min_, _max_, _event_, _phone_) {
    this.phoneNumber().main(_self_ => {
      _phone_.input = _event_.target.value;
      _self_.checkLength(_min_, _max_, _event_.target.value.length, checkLength => {
        if (checkLength) {
          _self_.matchString(/^\(?([0-9]{1,4})\)?[-. ]?([0-9]{1,4})[-. ]?([0-9]{1,4})[-. ]?([0-9]{1,4})$/, _event_.target.value, matchString => {
            console.log("onInput : matchString : ", matchString);
            if (matchString)
              _self_.checkIncludes(_phone_.number, _event_.target.value, checkIncludes => {
                _self_.newNumber(checkIncludes, _phone_.number, _event_.target.value, newNumber => {
                  _phone_.number = _phone_.number.concat(newNumber);
                  _self_.getNumberArray(_phone_.number, getNumberArray => {
                    _phone_.number_array = getNumberArray;
                  });
                });
              });
            _phone_.input = "";
            _event_.target.value = "";
          });
        }
      });
    });
  }

  inArrayPhone(_min_, _max_, _event_, _phone_) {
    this.phoneNumber().main(_self_ => {
      _phone_.input = _event_.target.value;
      _self_.checkLength(_min_, _max_, _event_.target.value.length, checkLength => {
        if (checkLength) {
          _self_.checkIncludes(_phone_.number, _event_.target.value, checkIncludes => {
            _self_.newNumber(checkIncludes, _phone_.number, _event_.target.value, newNumber => {
              _phone_.number = _phone_.number.concat(newNumber);
              _self_.getNumberArray(_phone_.number, getNumberArray => {
                _phone_.number_array = getNumberArray;
                _event_.target.value = "";
              });
            });
          });
        }
      });
    });
  }

  removePhoneNumberIndex(index, _phone_) {
    this.phoneNumber().main(_self_ => {
      _self_.removeNumberIndex(index, _phone_.number_array, removeNumberIndex => {
        _self_.getNumber(_phone_.number_array, getNumber => {
          _phone_.number = getNumber;
        });
      });
    });
  }
}
