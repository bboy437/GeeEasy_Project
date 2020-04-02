import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { WarehouseAPIService, LocationAPIService, UploadAPIService } from '@project/services';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
import { DialogsMapComponent } from '../../../dialogs/dialogs-map/dialogs-map.component';
import { DialogsCancelComponent } from '../../../dialogs/dialogs-cancel/dialogs-cancel.component';

// file service & external data
import JSON_PROVINCE from '../../../../../../../libs/shared/src/lib/json/province.json';
import JSON_LOCATION from '../../../../../../../libs/shared/src/lib/json/location.json';
import JSON_LOCATION_DETAIL from '../../../../../../../libs/shared/src/lib/json/location_detail.json';

@Component({
    selector: 'project-warehouse-create',
    templateUrl: './warehouse-create.component.html',
    styleUrls: ['./warehouse-create.component.scss']
})
export class WarehouseCreateComponent implements OnInit {

    @Input() id: string;
    @Output() closes = new EventEmitter<any>();
    strCancel = '';
    strSave = '';

    private UrlRouter_List = "products/warehouse/list";
    private UrlRouter_Detail = "products/warehouse/detail";
    stockForm: FormGroup;
    RowID: string;
    submitted = false;
    arrobjRow: any = [];
    loading = false;
    imgURL: any;
    public message = "No File chosen";
    imagePath: any = [];
    uploadData: any = [];
    warehouse_image_url: string;

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
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private locationService: LocationAPIService,
        private dialogService: NbDialogService,
        private uploadAPIService: UploadAPIService,
    ) {
        this.id_local = localStorage.getItem('id');
        console.log(' this.id_local', this.id_local);

        this.loading = true;
    }

    ngOnInit() {

        this.Builder();
        const params = this.route.snapshot.paramMap;
        console.log(params.get("id"));
        console.log(this.id);
        if (params.get("id")) {
            this.RowID = params.get("id");
        } else {
            this.RowID = this.id;
            this.strSave = "dialog";
            this.strCancel = "dialog";
        }

        console.log('strSave', this.strSave);

        if (this.RowID === "new") {
            this.loading = false;
        } else {
            this.warehouseAPIService.getWarehouseDetail(this.RowID).subscribe(data => {
                this.arrobjRow = data.response_data[0];
                console.log(this.arrobjRow);
                this.imgURL = data.response_data[0].warehouse_image_url;
                this.warehouse_image_url = data.response_data[0].warehouse_image_url;

                if (this.arrobjRow.warehouse_image_url !== undefined && this.arrobjRow.warehouse_image_url !== "-" && this.arrobjRow.warehouse_image_url !== "")
                    this.uploadAPIService.uploadImage().getUrl(this.arrobjRow.warehouse_image_url, red_image => {
                        this.image.main_image.get.push(red_image);
                    });

                this.phoneNumber().main(_self_ => {
                    data.response_data.forEach(item => {
                        _self_.getNumberArray(item.warehouse_tel, getNumberArray => {
                            this.phone.tel.number = item.warehouse_tel;
                            this.phone.tel.number_array = getNumberArray;
                        });
                        _self_.getNumberArray(item.warehouse_mobile, getNumberArray => {
                            this.phone.mobile.number = item.warehouse_mobile;
                            this.phone.mobile.number_array = getNumberArray;
                        });
                    });
                });

                /*Get Province Edit */
                this.changeProvinceEdit(
                    this.arrobjRow.warehouse_addr_province,
                    this.arrobjRow.warehouse_addr_amphoe,
                    this.arrobjRow.warehouse_addr_tambon
                );

                /*Value Data Form */
                this.editForm();
                this.loading = false;

            })
        }
    }


    Builder() {
        this.stockForm = this.fb.group({
            warehouseName: ['', Validators.required],
            telephoneNumber: [""],
            addressFull: ['', Validators.required],
            addressNo: ['', Validators.required],
            province: ['', Validators.required],
            amphoe: ['', Validators.required],
            tambon: ['', Validators.required],
            zipcode: ['', Validators.required],
            location_lat: [],
            location_lng: [],
            location_lat_location_lng: [{ value: '', disabled: true }, Validators.required],
        });
    }

    editForm() {
        this.stockForm.patchValue({
            warehouseName: this.arrobjRow.warehouse_name,
            phoneNo: this.arrobjRow.warehouse_tel,
            mobileNo: this.arrobjRow.warehouse_mobile,
            addressFull: this.arrobjRow.warehouse_addr_address_full,
            addressNo: this.arrobjRow.warehouse_addr_number,
            province: this.arrobjRow.warehouse_addr_province,
            amphoe: this.arrobjRow.warehouse_addr_amphoe,
            tambon: this.arrobjRow.warehouse_addr_tambon,
            zipcode: this.arrobjRow.warehouse_addr_post,
            location_lat: this.arrobjRow.warehouse_lat,
            location_lng: this.arrobjRow.warehouse_lng,
            location_lat_location_lng: this.arrobjRow.warehouse_lat + ',' + this.arrobjRow.warehouse_lng,
        });
    }


    get f() { return this.stockForm.controls; }
    onSubmit() {
        this.submitted = true;
        if (this.stockForm.invalid) {
            return;
        }
    }

    /*New Data Location ------------------------ */

    changeProvince(location_name) {
        this.stockForm.get('amphoe').patchValue("");
        this.stockForm.get('tambon').patchValue("");
        this.stockForm.get('zipcode').patchValue("");
        this.stockForm.get('location_lat').patchValue(0);
        this.stockForm.get('location_lng').patchValue(0);
        this.stockForm.get('location_lat_location_lng').patchValue(0 + ',' + 0);
        this.arrAmphoe = null;
        this.arrTambon = null;
        if (this.arrProvince.length > 0) {
            const arrProvince = this.arrProvince.filter((x) => x.location_name === location_name)
            this.get_Amphoe(+arrProvince[0].location_id);
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
        this.stockForm.get('tambon').patchValue("");
        this.stockForm.get('zipcode').patchValue("");
        this.stockForm.get('location_lat').patchValue(0);
        this.stockForm.get('location_lng').patchValue(0);
        this.stockForm.get('location_lat_location_lng').patchValue(0 + ',' + 0);
        this.arrTambon = null;
        if (this.arrAmphoe.length > 0) {
            const arrAmphoe = this.arrAmphoe.filter((x) => x.location_name === location_name)
            this.get_Tambon(+arrAmphoe[0].location_id);
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
            const arrTambon = this.arrTambon.filter((x) => x.location_name === location_name)
            this.stockForm.get('tambon').patchValue(arrTambon[0].location_name);
            this.stockForm.get('zipcode').patchValue(arrTambon[0].location_postcode);
            this.stockForm.get('location_lat').patchValue(0);
            this.stockForm.get('location_lng').patchValue(0);
            this.stockForm.get('location_lat_location_lng').patchValue(0 + ',' + 0);
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
            this.stockForm.get('province').patchValue(strProvince);
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
            this.stockForm.get('amphoe').patchValue(strAmphoe);
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
            const arrTambon = this.arrTambon.filter((x) => x.location_name === strTambon)
            this.stockForm.get('tambon').patchValue(arrTambon[0].location_name);
            this.stockForm.get('zipcode').patchValue(arrTambon[0].location_postcode);
        }
    }

    //--------------------------------------------


    btnDialogMab() {

        const dialogRef = this.dialogService.open(DialogsMapComponent, {
        });

        dialogRef.onClose.subscribe(result => {
            if (result) {
                console.log(result);
                this.stockForm.get('addressFull').patchValue(result.address);
                this.stockForm.get('addressNo').patchValue(result.num);
                this.stockForm.get('province').patchValue(result.state);
                this.stockForm.get('amphoe').patchValue(result.city);
                this.stockForm.get('tambon').patchValue(result.town);
                this.stockForm.get('zipcode').patchValue(result.zipcode);
                this.stockForm.get('location_lat').patchValue(result.supplier_addr_location_lat);
                this.stockForm.get('location_lng').patchValue(result.supplier_addr_location_lng);
                this.stockForm.get('location_lat_location_lng').patchValue(result.supplier_addr_location_lat + ',' + result.supplier_addr_location_lng);
                this.changeProvinceEdit(result.state, result.city, result.town);

            }

        });
    }

    clickLocation(event) {
        console.log('event', event)
    }

    btnSaveClick() {
        this.RowID = this.RowID

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
        if (this.stockForm.invalid || this.image.update) {
            return;
        }
        this.image.update = true;
        const dataSend = {
            type_id: 200,
            file_name: "",
            file_type: "",
            distributor_id: this.id_local,
            user_id: 0
        };
        this.uploadAPIService.uploadImage().getImageArray(dataSend, this.image.main_image.get, red_image_array => {
            console.log('btnSaveClick : red_image_array : ', red_image_array);
            this.image.main_image.port = red_image_array;
            this.save();
        });

    }

    save() {

        if (this.RowID === "new") {
            const dataJson = {
                "distributor_id": this.id_local,
                "warehouse_type_id": 2,
                "image_url": (this.image.main_image.port.length > 0) ? this.image.main_image.port[0].image_url : "-",
                "name": this.stockForm.value.warehouseName,
                "tel": this.phone.tel.number,
                "mobile": this.phone.mobile.number,
                "addr_address_full": this.stockForm.value.addressFull,
                "addr_number": this.stockForm.value.addressNo,
                "addr_province": this.stockForm.value.province,
                "addr_amphoe": this.stockForm.value.amphoe,
                "addr_tambon": this.stockForm.value.tambon,
                "addr_post": this.stockForm.value.zipcode,
                "location_lat": this.stockForm.value.location_lat,
                "location_lng": this.stockForm.value.location_lng,
            }
            console.log('dataJson', dataJson);
            this.warehouseAPIService.addWarehouse(JSON.stringify(dataJson)).subscribe(data => {
                console.log(data);
                // tslint:disable-next-line: triple-equals
                if (this.strSave == "dialog") {
                    this.closes.emit('ok')
                } else {
                    this.router.navigate([this.UrlRouter_List]);
                }
            })
        } else {
            const dataJson = {
                "warehouse_id": this.arrobjRow.warehouse_id,
                "distributor_id": this.id_local,
                "warehouse_type_id": 2,
                "image_url": (this.image.main_image.port.length > 0) ? this.image.main_image.port[0].image_url : "-",
                "name": this.stockForm.value.warehouseName,
                "tel": this.phone.tel.number,
                "mobile": this.phone.mobile.number,
                "addr_address_full": this.stockForm.value.addressFull,
                "addr_number": this.stockForm.value.addressNo,
                "addr_province": this.stockForm.value.province,
                "addr_amphoe": this.stockForm.value.amphoe,
                "addr_tambon": this.stockForm.value.tambon,
                "addr_post": this.stockForm.value.zipcode,
                "location_lat": this.stockForm.value.location_lat,
                "location_lng": this.stockForm.value.location_lng,
            }
            console.log(dataJson);
            console.log(JSON.stringify(dataJson));
            this.warehouseAPIService.updateWarehouse(JSON.stringify(dataJson)).subscribe(data => {
                console.log(data);
                this.router.navigate([this.UrlRouter_List]);
            })
        }

    }

    btnCancelClick() {
        const dialogRef = this.dialogService.open(DialogsCancelComponent, {
        });

        dialogRef.onClose.subscribe(result => {
            if (result === 'cancel') {
            }
            if (result === 'ok') {
                if (this.strCancel == "dialog") {
                    this.closes.emit('ok')
                } else {
                    this.router.navigate([this.UrlRouter_List]);
                }
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
                this.router.navigate([this.UrlRouter_Detail, this.RowID]);
            }
        });
    }



    uploadFile(event) {
        if (event.length === 0)
            return;

        const mimeType = event[0].type;
        if (mimeType.match(/image\/*/) == null) {
            this.message = "Only images are supported.";
            return;
        }
        const reader = new FileReader();
        this.message = event[0].name;
        this.imagePath = event[0];
        reader.readAsDataURL(event[0]);
        reader.onload = (_event) => {
            this.imgURL = reader.result;
        }
        console.log('imgURL', this.imgURL);

        this.upload()
    }


    upload() {
        const dataJson = {
            type_id: 200,
            file_name: this.imagePath.name,
            file_type: this.imagePath.type,
            distributor_id: this.id_local,
        }

        this.uploadAPIService.uploadImg(JSON.stringify(dataJson)).subscribe(res => {
            console.log(res);
            this.uploadData = res.response_data[0];
            this.warehouse_image_url = this.uploadData.file_url;

            this.uploadAPIService.uploadPut(this.uploadData.file_upload_url, this.imagePath).subscribe(res1 => {
                this.warehouse_image_url = this.uploadData.file_url;
                console.log(this.warehouse_image_url);
            })

        })

    }

    btnUpload() {
        this.uploadAPIService.uploadPut(this.uploadData.file_upload_url, this.imagePath).subscribe(res1 => {
            console.log(res1);
        })
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
                const res = (_phone_ !== '') ? _phone_.split(",") : "";
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
