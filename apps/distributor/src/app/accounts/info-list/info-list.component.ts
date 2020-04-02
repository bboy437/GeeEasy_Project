import { Router, ActivatedRoute } from "@angular/router";
import {
    DistributorAPIService,
    UploadAPIService,
    BrowseSupplierAPIService
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

    private UrlRouter_DistributorsList = "distributors/my-distributor/list";
    private UrlRouter_DistributorsDetail = "distributors/detail";

    arrobjRow: any = {};
    objAPIResponse: any = {};
    RowID: string;
    DistributorForm: FormGroup;
    submitted = false;
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
        private router: Router,
        private distributorAPIService: DistributorAPIService,
        private locationService: LocationAPIService,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private dialogService: NbDialogService,
        private uploadAPIService: UploadAPIService,
        private browseSupplierAPIService: BrowseSupplierAPIService
    ) {
        this.id_local = localStorage.getItem('id');
        console.log(' this.id_local', this.id_local);
        this.loading = true;
    }

    ngOnInit() {
        this.buildForm();
        // this.getCountryNew();
        this.getData();
    }

    getData() {
        const value = this.id_local;
        this.distributorAPIService.getDisDetail(value).subscribe(data => {
            if (data.response_data.length > 0 || data.response_data === false) {
                this.arrobjRow = data.response_data[0];
                this.imgURL = data.response_data[0].distributor_image_url;

                if (this.arrobjRow.distributor_image_url !== undefined && this.arrobjRow.distributor_image_url !== "-" && this.arrobjRow.distributor_image_url !== "")
                    this.uploadAPIService.uploadImage().getUrl(this.arrobjRow.distributor_image_url, red_image => {
                        this.image.main_image.get.push(red_image);
                    });

                /*Get Province Edit */
                this.changeProvinceEdit(
                    this.arrobjRow.distributor_addr_province,
                    this.arrobjRow.distributor_addr_amphoe,
                    this.arrobjRow.distributor_addr_tambon
                );

                this.getCategory();
                this.editForm();
                console.log(this.arrobjRow);

                this.phoneNumber().main(_self_ => {
                    data.response_data.forEach(item => {
                        _self_.getNumberArray(item.distributor_tel, getNumberArray => {
                            this.phone.tel.number = item.distributor_tel;
                            this.phone.tel.number_array = getNumberArray;
                        });
                        _self_.getNumberArray(item.distributor_mobile, getNumberArray => {
                            this.phone.mobile.number = item.distributor_mobile;
                            this.phone.mobile.number_array = getNumberArray;
                        });
                    });
                });
            }


            this.loading = false;
        })
    }

    getCategory() {
        const valueCategory = "cur_page=" + 1 + "&per_page=" + 10;
        this.browseSupplierAPIService
            .getCategoryDist(valueCategory)
            .subscribe(data => {
                this.arrCategory = data.response_data;
                setTimeout(() => {
                    this.DistributorForm.get('product_category_id').patchValue(Number(this.arrobjRow.product_category_id));
                }, 0);
                this.product_category_id = this.arrobjRow.product_category_id;
            });
    }

    get f() {
        return this.DistributorForm.controls;
    }
    onSubmit() {
        this.submitted = true;
        if (this.DistributorForm.invalid) {
            return;
        }
    }

    buildForm() {
        this.DistributorForm = this.formBuilder.group({
            distributor_name: ["", Validators.required],
            product_category_id: ["", Validators.required],
            product_category_root_id: [],
            distributor_catalog_keyword: ["", Validators.required],
            distributor_firstname: ["", Validators.required],
            distributor_lastname: ["", Validators.required],
            distributor_email: ["", [Validators.required, Validators.email]],
            telephoneNumber: [""],
            distributor_addr_full: ["", Validators.required],
            distributor_addr_number: ["", Validators.required],
            province: ['', Validators.required],
            amphoe: ['', Validators.required],
            tambon: ['', Validators.required],
            zipcode: ["", Validators.required],
            distributor_addr_lat: [],
            distributor_addr_lng: [],
            latitudeAndLongitude: [{ value: '', disabled: true }, Validators.required],
        });
    }

    editForm() {
        this.DistributorForm.patchValue({
            distributor_name: this.arrobjRow.distributor_name,
            product_category_id: this.arrobjRow.product_category_id,
            product_category_root_id: this.arrobjRow.product_category_root_id,
            distributor_catalog_keyword: this.arrobjRow.distributor_catalog_keyword,
            distributor_firstname: this.arrobjRow.distributor_firstname,
            distributor_lastname: this.arrobjRow.distributor_lastname,
            distributor_email: this.arrobjRow.distributor_email,
            distributor_addr_full: this.arrobjRow.distributor_addr_full,
            distributor_addr_number: this.arrobjRow.distributor_addr_number,
            latitudeAndLongitude: this.arrobjRow.distributor_addr_lat + ',' + this.arrobjRow.distributor_addr_lng,
            distributor_addr_lat: this.arrobjRow.distributor_addr_lat,
            distributor_addr_lng: this.arrobjRow.distributor_addr_lng,
        });
    }

    /*New Data Location ------------------------ */

    changeProvince(location_name) {
        this.DistributorForm.get('amphoe').patchValue("");
        this.DistributorForm.get('tambon').patchValue("");
        this.DistributorForm.get('zipcode').patchValue("");
        this.DistributorForm.get('distributor_addr_lat').patchValue(0);
        this.DistributorForm.get('distributor_addr_lng').patchValue(0);
        this.DistributorForm.get('latitudeAndLongitude').patchValue(0 + ',' + 0);
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
        this.DistributorForm.get('tambon').patchValue("");
        this.DistributorForm.get('zipcode').patchValue("");
        this.DistributorForm.get('distributor_addr_lat').patchValue(0);
        this.DistributorForm.get('distributor_addr_lng').patchValue(0);
        this.DistributorForm.get('latitudeAndLongitude').patchValue(0 + ',' + 0);
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
            this.DistributorForm.get('tambon').patchValue(arrTambon[0].location_name);
            this.DistributorForm.get('zipcode').patchValue(arrTambon[0].location_postcode);
            this.DistributorForm.get('distributor_addr_lat').patchValue(0);
            this.DistributorForm.get('distributor_addr_lng').patchValue(0);
            this.DistributorForm.get('latitudeAndLongitude').patchValue(0 + ',' + 0);
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
            this.DistributorForm.get('province').patchValue(strProvince);
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
            this.DistributorForm.get('amphoe').patchValue(strAmphoe);
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
            this.DistributorForm.get('tambon').patchValue(arrTambon[0].location_name);
            this.DistributorForm.get('zipcode').patchValue(arrTambon[0].location_postcode);
        }
    }

    //--------------------------------------------

    btnDialogMab() {

        const dialogRef = this.dialogService.open(DialogsMapComponent, {
        });

        dialogRef.onClose.subscribe(result => {
            if (result) {
                console.log(result);
                this.DistributorForm.get('distributor_addr_full').patchValue(result.address);
                this.DistributorForm.get('distributor_addr_number').patchValue(result.num);
                this.DistributorForm.get('province').patchValue(result.state);
                this.DistributorForm.get('amphoe').patchValue(result.city);
                this.DistributorForm.get('tambon').patchValue(result.town);
                this.DistributorForm.get('zipcode').patchValue(result.zipcode);
                this.DistributorForm.get('distributor_addr_lat').patchValue(result.supplier_addr_location_lat);
                this.DistributorForm.get('distributor_addr_lng').patchValue(result.supplier_addr_location_lng);
                this.DistributorForm.get('latitudeAndLongitude').patchValue(result.supplier_addr_location_lat + ',' + result.supplier_addr_location_lng);
                this.changeProvinceEdit(result.state, result.city, result.town);

            }

        });
    }

    categoryEvent(event) {
        if (event.product_category__id !== 0) {
            this.DistributorForm.get('product_category_id').patchValue(event.product_category__id);
            this.DistributorForm.get('product_category_root_id').patchValue(event.product_category_root_id);
        } else {
            this.DistributorForm.get('product_category_id').patchValue("");
            this.DistributorForm.get('product_category_root_id').patchValue("");
        }
        console.log('event', event);

    }

    btnSaveClick() {
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

        console.log('btnSaveClick : DistributorForm : ', this.DistributorForm);
        this.submitted = true;
        if (this.DistributorForm.invalid || this.image.update || this.phone.tel.number === "" || this.phone.mobile.number === "") {
            return;
        }
        this.image.update = true;
        const dataSend = {
            type_id: 100,
            file_name: "",
            file_type: "",
            distributor_id: this.id_local
        };
        this.uploadAPIService.uploadImage().getImageArray(dataSend, this.image.main_image.get, red_image_array => {
            console.log('btnSaveClick : red_image_array : ', red_image_array);
            this.image.main_image.port = red_image_array;
            this.save();
        });
    }

    save() {
        this.loading = true;
        const dataEdit = {
            distributor_id: this.arrobjRow.distributor_id,
            dealer_id: this.arrobjRow.dealer_id,
            sale_rep_id: this.arrobjRow.sale_rep_id,
            distributor_tel: this.phone.tel.number,
            distributor_mobile: this.phone.mobile.number,
            distributor_image_url: (this.image.main_image.port.length > 0) ? this.image.main_image.port[0].image_url : "-",
            distributor_name: this.DistributorForm.value.distributor_name,
            product_category_id: this.DistributorForm.value.product_category_id,
            product_category_root_id: this.DistributorForm.value.product_category_root_id,
            distributor_catalog_keyword: this.DistributorForm.value.distributor_catalog_keyword,
            distributor_firstname: this.DistributorForm.value.distributor_firstname,
            distributor_lastname: this.DistributorForm.value.distributor_lastname,
            distributor_email: this.DistributorForm.value.distributor_email,
            distributor_addr_full: this.DistributorForm.value.distributor_addr_full,
            distributor_addr_number: this.DistributorForm.value.distributor_addr_number,
            distributor_addr_tambon: this.DistributorForm.value.tambon,
            distributor_addr_amphoe: this.DistributorForm.value.amphoe,
            distributor_addr_province: this.DistributorForm.value.province,
            distributor_addr_post: this.DistributorForm.value.zipcode,
            distributor_addr_lat: this.DistributorForm.value.distributor_addr_lat,
            distributor_addr_lng: this.DistributorForm.value.distributor_addr_lng
        }
        const dataJson = JSON.stringify(dataEdit);
        console.log("save : arrobjRow : ", dataEdit);

        this.distributorAPIService.updateDistributor(dataJson).subscribe(data => {
            // this.router.navigate([this.UrlRouter_DistributorsList]);
            this.loading = false;
            this.image.update = false;
        });
    }

    btnCancelClick() {
        const dialogRef = this.dialogService.open(DialogsCancelComponent, {});

        dialogRef.onClose.subscribe(result => {
            if (result === "cancel") {
            }
            if (result === "ok") {
                this.router.navigate([this.UrlRouter_DistributorsList]);
            }
        });
    }

    btnBackClick() {
        const dialogRef = this.dialogService.open(DialogsCancelComponent, {});

        dialogRef.onClose.subscribe(result => {
            if (result === "cancel") {
            }
            if (result === "ok") {
                this.router.navigate([this.UrlRouter_DistributorsDetail, this.RowID]);
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
            supplier_id: 13356,
            distributor_id: 0
        };

        this.uploadAPIService.uploadImg(JSON.stringify(dataJson)).subscribe(res => {
            console.log(res);
            this.uploadData = res.response_data[0];

            this.uploadAPIService
                .uploadPut(this.uploadData.file_upload_url, this.imagePath)
                .subscribe(res1 => {
                    console.log(res1);
                    this.arrobjRow.distributor_image_url = this.uploadData.file_url;
                    console.log(this.arrobjRow.distributor_image_url);
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
                const res = _phone_.split(",");
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
