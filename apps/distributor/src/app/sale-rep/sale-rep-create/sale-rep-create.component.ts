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
import { INgxSelectOption } from 'ngx-select-ex';

// file service & external data
import JSON_PROVINCE from '../../../../../../libs/shared/src/lib/json/province.json';
import JSON_LOCATION from '../../../../../../libs/shared/src/lib/json/location.json';
import JSON_LOCATION_DETAIL from '../../../../../../libs/shared/src/lib/json/location_detail.json';

@Component({
    selector: "project-sale-rep-create",
    templateUrl: "./sale-rep-create.component.html",
    styleUrls: ["./sale-rep-create.component.scss"]
})

export class SaleRepCreateComponent implements OnInit {

    private listPage = "sale-rep/list";
    private detailPage = "sale-rep/detail";
    arrobjRow: any = {};
    RowID: string;
    Form: FormGroup;
    submitted = false;
    arrobjState: any = [];
    arrobjCity: any = [];
    arrobjTown: any = [];
    imagePath: any = [];
    uploadData: any = [];
    imgURL: any;
    public message = "No File chosen";
    arrCategory: any = [];
    product_category_id: string;
    loading = false;
    isReload = false;

    arrProvince: any[] = JSON_PROVINCE;
    arrAmphoe: any[];
    arrTambon: any[];
    arrLocation: any[] = JSON_LOCATION;
    arrLocationDetail: any[] = JSON_LOCATION_DETAIL;


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

    image = {
        update: false,
        main_image: {
            get: [],
            port: []
        }
    }

    constructor(
        private router: Router,
        private locationService: LocationAPIService,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private dialogService: NbDialogService,
        private uploadAPIService: UploadAPIService,
        private browseSupplierAPIService: BrowseSupplierAPIService,
        private saleRepService: SaleRepService
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
            this.getCategory();
            this.loading = false;
        } else {


            this.getSalerepAccountDetail(res => {
                console.log("ngOnInit : getSalerepAccountDetail : res : ", res);
                this.arrobjRow = res.response_data[0];
                console.log("ngOnInit : res : ", res);
                this.imgURL = res.response_data[0].sale_rep_image_url;
                if (this.arrobjRow.sale_rep_image_url !== undefined && this.arrobjRow.sale_rep_image_url !== "-" && this.arrobjRow.sale_rep_image_url !== "")
                    this.uploadAPIService.uploadImage().getUrl(this.arrobjRow.sale_rep_image_url, red_image => {
                        this.image.main_image.get.push(red_image);
                    });

                this.editForm();
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
                /*Get Province Edit */
                this.changeProvinceEdit(
                    this.arrobjRow.sale_rep_addr_province,
                    this.arrobjRow.sale_rep_addr_amphoe,
                    this.arrobjRow.sale_rep_addr_tambon
                );
            })
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
            sale_rep_name: ["", Validators.required],
            sale_rep_company: ["", Validators.required],
            sale_rep_tag: ["", Validators.required],
            sale_rep_first_name: ["", Validators.required],
            sale_rep_last_name: ["", Validators.required],
            sale_rep_email: ["", [Validators.required, Validators.email]],
            telephoneNumber: [""],
            addressFull: ['', Validators.required],
            addressNo: ['', Validators.required],
            province: ["", Validators.required],
            amphoe: ["", Validators.required],
            tambon: ["", Validators.required],
            zipcode: ["", Validators.required],
            location_lat: [],
            location_lng: [],
            location_lat_location_lng: [{ value: "", disabled: true }, Validators.required],
        });
    }

    editForm() {
        this.Form.patchValue({
            sale_rep_name: this.arrobjRow.sale_rep_name,
            sale_rep_company: this.arrobjRow.sale_rep_company,
            sale_rep_tag: this.arrobjRow.sale_rep_tag,
            sale_rep_first_name: this.arrobjRow.sale_rep_first_name,
            sale_rep_last_name: this.arrobjRow.sale_rep_last_name,
            sale_rep_email: this.arrobjRow.sale_rep_email,
            addressFull: this.arrobjRow.sale_rep_addr_full,
            addressNo: this.arrobjRow.sale_rep_addr_number,
            location_lat_location_lng: this.arrobjRow.sale_rep_addr_lat + ',' + this.arrobjRow.sale_rep_addr_lng,
            location_lat: this.arrobjRow.sale_rep_addr_lat,
            location_lng: this.arrobjRow.sale_rep_addr_lng,
        });
        this.loading = false;
    }

    /*New Data Location ------------------------ */

    changeProvince(location_name) {
        this.Form.get('amphoe').patchValue("");
        this.Form.get('tambon').patchValue("");
        this.Form.get('zipcode').patchValue("");
        this.Form.get('location_lat').patchValue(0);
        this.Form.get('location_lng').patchValue(0);
        this.Form.get('location_lat_location_lng').patchValue(0 + ',' + 0);
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
        this.Form.get('tambon').patchValue("");
        this.Form.get('zipcode').patchValue("");
        this.Form.get('location_lat').patchValue(0);
        this.Form.get('location_lng').patchValue(0);
        this.Form.get('location_lat_location_lng').patchValue(0 + ',' + 0);
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
            this.Form.get('tambon').patchValue(arrTambon[0].location_name);
            this.Form.get('zipcode').patchValue(arrTambon[0].location_postcode);
            this.Form.get('location_lat').patchValue(0);
            this.Form.get('location_lng').patchValue(0);
            this.Form.get('location_lat_location_lng').patchValue(0 + ',' + 0);
            console.log("Form", this.Form.value);
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
            this.Form.get('province').patchValue(strProvince);
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
            this.Form.get('amphoe').patchValue(strAmphoe);
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
            this.Form.get('tambon').patchValue(arrTambon[0].location_name);
            this.Form.get('zipcode').patchValue(arrTambon[0].location_postcode);
            console.log("Form", this.Form.value);
        }
    }

    //--------------------------------------------

    btnDialogMab() {

        const dialogRef = this.dialogService.open(DialogsMapComponent, {
        });

        dialogRef.onClose.subscribe(result => {
            if (result) {
                console.log(result);
                this.Form.get('addressFull').patchValue(result.address);
                this.Form.get('addressNo').patchValue(result.num);
                this.Form.get('province').patchValue(result.state);
                this.Form.get('amphoe').patchValue(result.city);
                this.Form.get('tambon').patchValue(result.town);
                this.Form.get('zipcode').patchValue(result.zipcode);
                this.Form.get('location_lat').patchValue(result.supplier_addr_location_lat);
                this.Form.get('location_lng').patchValue(result.supplier_addr_location_lng);
                this.Form.get('location_lat_location_lng').patchValue(result.supplier_addr_location_lat + ',' + result.supplier_addr_location_lng);
                this.changeProvinceEdit(result.state, result.city, result.town);

            }

        });
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

        console.log('btnSaveClick : Form : ', this.Form);
        this.submitted = true;
        if (this.Form.invalid || this.image.update || this.phone.tel.number === "" || this.phone.mobile.number === "") {
            return;
        }
        this.image.update = true;
        const dataSend = {
            type_id: 200,
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
        if (this.RowID === "new") {
            const dataJsons = {
                distributor_id: this.id_local,
                dealer_id: 0,
                sale_rep_id: 0,
                sale_rep_image_url: (this.image.main_image.port.length > 0) ? this.image.main_image.port[0].image_url : "-",
                sale_rep_name: this.Form.value.sale_rep_company,
                sale_rep_company: this.Form.value.sale_rep_name,
                sale_rep_tag: this.Form.value.sale_rep_tag,
                sale_rep_first_name: this.Form.value.sale_rep_first_name,
                sale_rep_last_name: this.Form.value.sale_rep_last_name,
                sale_rep_email: this.Form.value.sale_rep_email,
                sale_rep_mobile: this.phone.mobile.number,
                sale_rep_tel: this.phone.tel.number,
                sale_rep_addr_full: this.Form.value.addressFull,
                sale_rep_addr_number: this.Form.value.addressNo,
                sale_rep_addr_province: this.Form.value.province,
                sale_rep_addr_amphoe: this.Form.value.amphoe,
                sale_rep_addr_tambon: this.Form.value.tambon,
                sale_rep_addr_post: this.Form.value.zipcode,
                sale_rep_addr_lat: this.Form.value.location_lat,
                sale_rep_addr_lng: this.Form.value.location_lng
            }

            const dataJson = JSON.stringify(dataJsons);
            console.log("save : dataJson : ", dataJsons);

            this.saleRepService.postSalerepAccountCreate(dataJson).subscribe(data => {
                this.Form.reset();
                this.router.navigate([this.listPage]);
            });
        } else {
            const dataJsons = {
                distributor_id: this.arrobjRow.distributor_id,
                dealer_id: this.arrobjRow.dealer_id,
                sale_rep_id: this.arrobjRow.sale_rep_id,
                sale_rep_image_url: (this.image.main_image.port.length > 0) ? this.image.main_image.port[0].image_url : "-",
                sale_rep_name: this.Form.value.sale_rep_company,
                sale_rep_company: this.Form.value.sale_rep_name,
                sale_rep_tag: this.Form.value.sale_rep_tag,
                sale_rep_first_name: this.Form.value.sale_rep_first_name,
                sale_rep_last_name: this.Form.value.sale_rep_last_name,
                sale_rep_email: this.Form.value.sale_rep_email,
                sale_rep_mobile: this.phone.mobile.number,
                sale_rep_tel: this.phone.tel.number,
                sale_rep_addr_full: this.Form.value.addressFull,
                sale_rep_addr_number: this.Form.value.addressNo,
                sale_rep_addr_province: this.Form.value.province,
                sale_rep_addr_amphoe: this.Form.value.amphoe,
                sale_rep_addr_tambon: this.Form.value.tambon,
                sale_rep_addr_post: this.Form.value.zipcode,
                sale_rep_addr_lat: this.Form.value.location_lat,
                sale_rep_addr_lng: this.Form.value.location_lng
            }

            const dataJson = JSON.stringify(dataJsons);
            console.log("save : arrobjRow : ", dataJsons);

            this.saleRepService.postSalerepAccountUpdate(dataJson).subscribe(data => {
                this.Form.reset();
                this.router.navigate([this.listPage]);
            });
        }
    }

    btnCancelClick() {
        this.router.navigate([this.listPage]);
    }

    btnBackClick() {
        this.router.navigate([this.detailPage, this.RowID]);
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
            distributor_id: this.id_local,
            sale_rep_id: 0
        };

        this.uploadAPIService.uploadImg(JSON.stringify(dataJson)).subscribe(res => {
            console.log(res);
            this.uploadData = res.response_data[0];
            this.arrobjRow.sale_rep_image_url = this.uploadData.file_url;
            this.uploadAPIService
                .uploadPut(this.uploadData.file_upload_url, this.imagePath)
                .subscribe(res1 => {
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
