import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocationAPIService, UploadAPIService } from '@project/services';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DealerAPIService } from '@project/services';
import { NbDialogService } from '@nebular/theme';
import { DialogsMapComponent } from '../../dialogs/dialogs-map/dialogs-map.component';
import { DialogsCancelComponent } from '../../dialogs/dialogs-cancel/dialogs-cancel.component';

// file service & external data
import JSON_PROVINCE from '../../../../../../libs/shared/src/lib/json/province.json';
import JSON_LOCATION from '../../../../../../libs/shared/src/lib/json/location.json';
import JSON_LOCATION_DETAIL from '../../../../../../libs/shared/src/lib/json/location_detail.json';

@Component({
  selector: 'project-info-list',
  templateUrl: './info-list.component.html',
  styleUrls: ['./info-list.component.scss']
})
export class InfoListComponent implements OnInit {

  private UrlRouter_DealersList = "dealers/list";
  private UrlRouter_DealersDetail = "dealers/detail";
  arrobjRow: any = {};
  objAPIResponse: any = {};
  RowID: string;
  dealersFrom: FormGroup;
  submitted = false;
  arrobjState: any = [];
  arrobjCity: any = [];
  arrobjTown: any = [];
  strZipcode: string;
  strState = "";
  strTown = "";
  strCity = "";
  isValidatorsstate: string;
  isValidatorsTown: string;
  isValidatorsCity: string;
  public imagePath;
  imgURL: any;
  public message: string;
  uploadData: any = [];
  location_lat = 0;
  location_lng = 0;
  loading = false;


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

  arrProvince: any[] = JSON_PROVINCE;
  arrAmphoe: any[];
  arrTambon: any[];
  arrLocation: any[] = JSON_LOCATION;
  arrLocationDetail: any[] = JSON_LOCATION_DETAIL;

  image = {
    update: false,
    main_image: {
      get: [],
      port: []
    }
  }


  id_local: string;

  constructor(
    private router: Router,
    private locationService: LocationAPIService,
    private route: ActivatedRoute,
    private dealerAPIService: DealerAPIService,
    private formBuilder: FormBuilder,
    private dialogService: NbDialogService,
    private uploadAPIService: UploadAPIService,
  ) {
    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);
    this.loading = true;
  }

  ngOnInit() {

    this.buildForm();

  }
  //2571677
  getData() {
    const value = this.id_local;
    this.dealerAPIService.getDealerDetail(value).subscribe(data => {
      if (data.response_data.length > 0) {
        this.arrobjRow = data.response_data[0];
        this.imgURL = this.arrobjRow.dealer_image_url;

        if (this.arrobjRow.dealer_image_url !== undefined && this.arrobjRow.dealer_image_url !== "-" && this.arrobjRow.dealer_image_url !== "")
          this.uploadAPIService.uploadImage().getUrl(this.arrobjRow.dealer_image_url, red_image => {
            this.image.main_image.get.push(red_image);
          });

        this.location_lat = this.arrobjRow.dealer_addr_lat;
        this.location_lng = this.arrobjRow.dealer_addr_lng;
        console.log('getData', this.arrobjRow);
        this.editForm();
        this.changeProvinceEdit(this.arrobjRow.dealer_addr_province, this.arrobjRow.dealer_addr_amphoe, this.arrobjRow.dealer_addr_tambon);

        this.phoneNumber().main(_self_ => {
          data.response_data.forEach(item => {
            _self_.getNumberArray(item.dealer_tel, getNumberArray => {
              this.phone.tel.number = item.dealer_tel;
              this.phone.tel.number_array = getNumberArray;
            });
            _self_.getNumberArray(item.dealer_mobile, getNumberArray => {
              this.phone.mobile.number = item.dealer_mobile;
              this.phone.mobile.number_array = getNumberArray;
            });
          });
        });


      }

      this.loading = false;
    })
  }

  buildForm() {
    this.dealersFrom = this.formBuilder.group({
      dealersName: ['', Validators.required],
      productcategory: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      companyName: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      telephoneNumber: [""],
      addressFull: ['', Validators.required],
      addressNo: ['', Validators.required],
      province: ['', Validators.required],
      amphoe: ['', Validators.required],
      tambon: ['', Validators.required],
      zipcode: ['', Validators.required],
      latitudeAndLongitude: [{ value: '', disabled: true }, Validators.required],
      dealer_addr_lng: [],
      dealer_addr_lat: []
    });
    this.getData();

  }




  editForm() {
    this.dealersFrom.patchValue({
      dealersName: this.arrobjRow.dealer_name,
      productcategory: this.arrobjRow.dealer_tag,
      firstName: this.arrobjRow.dealer_first_name,
      lastName: this.arrobjRow.dealer_last_name,
      companyName: this.arrobjRow.dealer_company,
      emailAddress: this.arrobjRow.dealer_email,
      // phoneNo: this.arrobjRow.dealer_tel,
      // mobileNo: this.arrobjRow.dealer_mobile,
      addressFull: this.arrobjRow.dealer_addr_full,
      addressNo: this.arrobjRow.dealer_addr_number,
      // province: this.arrobjRow.dealer_name,
      // amphoe: this.arrobjRow.dealer_name,
      // tambon: this.arrobjRow.dealer_name,
      // zipcode: this.arrobjRow.dealer_addr_post,
      latitudeAndLongitude: this.arrobjRow.dealer_addr_lat + ',' + this.arrobjRow.dealer_addr_lng,
      dealer_addr_lat: this.arrobjRow.dealer_addr_lat,
      dealer_addr_lng: this.arrobjRow.dealer_addr_lng,
    });
    this.loading = false;
  }

  /*New Data Location ------------------------ */

  changeProvince(location_name) {

    setTimeout(() => {
      this.dealersFrom.get('amphoe').patchValue("");
      this.dealersFrom.get('tambon').patchValue("");
      this.dealersFrom.get('zipcode').patchValue("");
      this.dealersFrom.get('dealer_addr_lat').patchValue(0);
      this.dealersFrom.get('dealer_addr_lng').patchValue(0);
      this.dealersFrom.get('latitudeAndLongitude').patchValue(0 + ',' + 0);
    }, 0);
    this.arrAmphoe = null;
    this.arrTambon = null;
    if (this.arrProvince.length > 0) {
      for (let i = 0; i < this.arrProvince.length; i++) {
        if (this.arrProvince[i].location_name === location_name) {
          const location_id = Number(this.arrProvince[i].location_id);
          this.get_Amphoe(location_id);
        }
      }
    }
  }

  async get_Amphoe(location_id) {

    const get_detail_by_id = (id) => {
      return this.arrLocationDetail.filter(row => {
        if (row.location_id === id) {
          return true;
        }
        return false;
      });
    };

    const newArray = [];
    await this.arrLocation.forEach(row => {
      if (row.parent_id == location_id) {
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

    this.arrAmphoe = newArray;

    console.log("get_Amphoe : arrAmphoe", this.arrAmphoe);
  }

  changeAmphoe(location_name) {
    setTimeout(() => {
      this.dealersFrom.get('tambon').patchValue("");
      this.dealersFrom.get('zipcode').patchValue("");
      this.dealersFrom.get('dealer_addr_lat').patchValue(0);
      this.dealersFrom.get('dealer_addr_lng').patchValue(0);
      this.dealersFrom.get('latitudeAndLongitude').patchValue(0 + ',' + 0);
    }, 0);
    this.arrTambon = null;
    if (this.arrAmphoe.length > 0) {
      for (let i = 0; i < this.arrAmphoe.length; i++) {
        if (this.arrAmphoe[i].location_name === location_name) {
          const location_id = Number(this.arrAmphoe[i].location_id);
          this.get_Tambon(location_id);
        }
      }
    }
  }

  async get_Tambon(location_id) {

    const get_detail_by_id = (id) => {
      return this.arrLocationDetail.filter(row => {
        if (row.location_id === id) {
          return true;
        }
        return false;
      });
    };

    const newArray = [];
    await this.arrLocation.forEach(row => {
      if (row.parent_id == location_id) {
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

    this.arrTambon = newArray;
    console.log("arrTambon", this.arrTambon);
  }

  changeTambon(location_name) {
    if (this.arrTambon.length > 0) {
      for (let i = 0; i < this.arrTambon.length; i++) {
        if (this.arrTambon[i].location_name === location_name) {
          setTimeout(() => {
            this.dealersFrom.get('tambon').patchValue(this.arrTambon[i].location_name);
            this.dealersFrom.get('zipcode').patchValue(this.arrTambon[i].location_postcode);
            this.dealersFrom.get('dealer_addr_lat').patchValue(0);
            this.dealersFrom.get('dealer_addr_lng').patchValue(0);
            this.dealersFrom.get('latitudeAndLongitude').patchValue(0 + ',' + 0);
          }, 0);
        }
      }
    }
  }

  /*Edit Data Location ------------------------ */

  /*Change Province Edit */
  async changeProvinceEdit(strProvince, strAmphoe, strTambon) {
    const thisLocation = await this.arrProvince.filter(row => {
      if (row.location_name.indexOf(strProvince) !== -1) {
        return true;
      }
      return false;
    });
    if (thisLocation.length > 0) {
      setTimeout(() => {
        this.dealersFrom.get('province').patchValue(strProvince);
      }, 0);
      this.get_Amphoe_Edit(thisLocation[0].location_id, strAmphoe, strTambon);
    }

  }

  /*Get Amphoe Edit */
  async get_Amphoe_Edit(location_id, strAmphoe, strTambon) {

    const get_detail_by_id = (id) => {
      return this.arrLocationDetail.filter(row => {
        if (row.location_id == id) {
          return true;
        }
        return false;
      });
    };
    const newArray = [];
    await this.arrLocation.forEach(row => {
      if (row.parent_id == location_id) {
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

    this.arrAmphoe = newArray;
    this.changeAmphoeEdit(strAmphoe, strTambon);

  }

  /*Change Amphoe Edit */
  async changeAmphoeEdit(strAmphoe, strTambon) {

    const thisLocation = await this.arrAmphoe.filter(row => {
      if (row.location_name.indexOf(strAmphoe) !== -1) {
        return true;
      }
      return false;
    });
    if (thisLocation.length > 0) {
      setTimeout(() => {
        this.dealersFrom.get('amphoe').patchValue(strAmphoe);
      }, 0);
      this.get_Tambon_Edit(thisLocation[0].location_id, strTambon)
    }


  }

  /*Get Tambon Edit */
  async get_Tambon_Edit(location_id, strTambon) {

    const get_detail_by_id = (id) => {
      return this.arrLocationDetail.filter(row => {
        if (row.location_id == id) {
          return true;
        }
        return false;
      });
    };

    const newArray = [];
    await this.arrLocation.forEach(row => {
      if (row.parent_id == location_id) {
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

    this.arrTambon = newArray;
    this.changeTambonEdit(strTambon);

  }

  /*Change Tambon Edit */
  changeTambonEdit(strTambon) {
    if (this.arrTambon.length > 0) {
      for (let i = 0; i < this.arrTambon.length; i++) {
        if (this.arrTambon[i].location_name === strTambon) {
          setTimeout(() => {
            this.dealersFrom.get('tambon').patchValue(this.arrTambon[i].location_name);
            this.dealersFrom.get('zipcode').patchValue(this.arrTambon[i].location_postcode);
          }, 0);
        }
      }
    }
  }




  btnDialogMab() {

    const dialogRef = this.dialogService.open(DialogsMapComponent, {
    });

    dialogRef.onClose.subscribe(result => {
      if (result) {

        setTimeout(() => {
          this.dealersFrom.get('addressFull').patchValue(result.address);
          this.dealersFrom.get('addressNo').patchValue(result.num);
          this.dealersFrom.get('province').patchValue(result.state);
          this.dealersFrom.get('amphoe').patchValue(result.city);
          this.dealersFrom.get('tambon').patchValue(result.town);
          this.dealersFrom.get('zipcode').patchValue(result.zipcode);
          this.dealersFrom.get('dealer_addr_lat').patchValue(result.supplier_addr_location_lat);
          this.dealersFrom.get('dealer_addr_lng').patchValue(result.supplier_addr_location_lng);
          this.dealersFrom.get('latitudeAndLongitude').patchValue(result.supplier_addr_location_lat + ',' + result.supplier_addr_location_lng);
        }, 0);



        this.changeProvinceEdit(result.state, result.city, result.town);

      }

    });
  }




  get f() { return this.dealersFrom.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.dealersFrom.invalid) {
      return;
    }
  }


  btnCancelClick() {
    const dialogRef = this.dialogService.open(DialogsCancelComponent, {
    });

    dialogRef.onClose.subscribe(result => {
      if (result === 'cancel') {
      }
      if (result === 'ok') {
        this.router.navigate([this.UrlRouter_DealersList]);
      }
    });
  }

  btnBackClick() {
    const dialogRef = this.dialogService.open(DialogsCancelComponent, {
    });

    dialogRef.onClose.subscribe(result => {
      if (result === 'cancel') {
      }
      if (result === 'ok') {
        this.router.navigate([this.UrlRouter_DealersDetail, this.RowID]);
      }
    });
  }



  btnSaveClick() {
    console.log(this.dealersFrom);
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

    this.submitted = true;
    if (this.dealersFrom.invalid || this.image.update || this.phone.tel.number === "" || this.phone.mobile.number === "") {
      return;
    }

    this.image.update = true;
    const dataSend = {
      type_id: 600,
      file_name: "",
      file_type: "",
      dealer_id: this.id_local
    };
    this.uploadAPIService.uploadImage().getImageArray(dataSend, this.image.main_image.get, red_image_array => {
      console.log('btnSaveClick : red_image_array : ', red_image_array);
      this.image.main_image.port = red_image_array;
      this.save();
    });

  }



  save() {
    this.loading = true;

    const dataJsons = {
      "dealer_id": this.id_local,
      "distributor_id": 0,
      "sale_rep_id": 0,
      "dealer_name": this.dealersFrom.value.dealersName,
      "dealer_first_name": this.dealersFrom.value.firstName,
      "dealer_last_name": this.dealersFrom.value.lastName,
      "dealer_tel": this.phone.tel.number,
      "dealer_mobile": this.phone.mobile.number,
      "dealer_email": this.dealersFrom.value.emailAddress,
      "dealer_tag": this.dealersFrom.value.productcategory,
      "dealer_company": this.dealersFrom.value.companyName,
      "dealer_addr_full": this.dealersFrom.value.addressFull,
      "dealer_addr_number": this.dealersFrom.value.addressNo,
      "dealer_addr_tambon": this.dealersFrom.value.tambon,
      "dealer_addr_amphoe": this.dealersFrom.value.amphoe,
      "dealer_addr_province": this.dealersFrom.value.province,
      "dealer_addr_post": this.dealersFrom.value.zipcode,
      "dealer_addr_lat": this.dealersFrom.value.dealer_addr_lat,
      "dealer_addr_lng": this.dealersFrom.value.dealer_addr_lng,
      "dealer_image_url": (this.image.main_image.port.length > 0) ? this.image.main_image.port[0].image_url : "-"
    }

    const dataJson = JSON.stringify(dataJsons)
    console.log(dataJsons);

    this.dealerAPIService.updateDealer(dataJson).subscribe(data => {
      // this.router.navigate([this.UrlRouter_DealersList]);
      console.log(data);
      this.getData();
    })
  }



  btnClear() {
    this.dealersFrom.reset('')
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
        const res = (_phone_ !== undefined) ? _phone_.split(",") : [];
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

