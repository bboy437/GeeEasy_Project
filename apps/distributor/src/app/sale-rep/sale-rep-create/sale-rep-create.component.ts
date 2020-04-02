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
    SaleForm: FormGroup;
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
            this.getCountryNew();
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
                this.getStateEdit();
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
                this.loading = false;
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
            sale_rep_name: ["", Validators.required],
            sale_rep_company: ["", Validators.required],
            sale_rep_tag: ["", Validators.required],
            sale_rep_first_name: ["", Validators.required],
            sale_rep_last_name: ["", Validators.required],
            sale_rep_email: ["", [Validators.required, Validators.email]],
            telephoneNumber: [""],
            sale_rep_addr_full: ["", Validators.required],
            sale_rep_addr_number: ["", Validators.required],
            province: ['', Validators.required],
            amphoe: ['', Validators.required],
            tambon: ['', Validators.required],
            zipcode: ["", Validators.required],
            latitudeAndLongitude: [{ value: '', disabled: true }, Validators.required],
            sale_rep_addr_lat: [],
            sale_rep_addr_lng: []
        });
    }

    editForm() {
        this.SaleForm.patchValue({
            sale_rep_name: this.arrobjRow.sale_rep_name,
            sale_rep_company: this.arrobjRow.sale_rep_company,
            sale_rep_tag: this.arrobjRow.sale_rep_tag,
            sale_rep_first_name: this.arrobjRow.sale_rep_first_name,
            sale_rep_last_name: this.arrobjRow.sale_rep_last_name,
            sale_rep_email: this.arrobjRow.sale_rep_email,
            sale_rep_addr_full: this.arrobjRow.sale_rep_addr_full,
            sale_rep_addr_number: this.arrobjRow.sale_rep_addr_number,
            latitudeAndLongitude: this.arrobjRow.sale_rep_addr_lat + ',' + this.arrobjRow.sale_rep_addr_lng,
            sale_rep_addr_lat: this.arrobjRow.sale_rep_addr_lat,
            sale_rep_addr_lng: this.arrobjRow.sale_rep_addr_lng,
        });
    }

    // New ----------------------------------------------------------

    getCountryNew() {
        //getState
        const dataState = 'txt_location_type_id=' + 2 + '&txt_parent_id=' + 231 + '&cur_page=' + 1 + '&per_page=' + 100
        this.locationService.get(dataState).subscribe(data => {
            this.arrobjState = data.data.dataList;
        })
    }
    getStateNew(event: INgxSelectOption[]) {
        console.log('event', event);

        setTimeout(() => {
            this.SaleForm.get('amphoe').patchValue("");
            this.SaleForm.get('tambon').patchValue("");
            this.SaleForm.get('zipcode').patchValue("");
            this.SaleForm.get('sale_rep_addr_lat').patchValue(0);
            this.SaleForm.get('sale_rep_addr_lng').patchValue(0);
            this.SaleForm.get('latitudeAndLongitude').patchValue(0 + ',' + 0);
        }, 0);
        this.arrobjCity = null
        this.arrobjTown = null;
        if (this.arrobjState.length > 0) {
            for (let i = 0; i < this.arrobjState.length; i++) {
                if (this.arrobjState[i].location_name === event) {
                    const parentID = this.arrobjState[i].location_id;
                    //getCity
                    const dataCity = 'txt_location_type_id=' + 3 + '&txt_parent_id=' + parentID + '&cur_page=' + 1 + '&per_page=' + 100
                    this.locationService.get(dataCity).subscribe(data => {
                        this.arrobjCity = data.data.dataList;
                    })
                }
            }
        }
    }


    getCityNew(event: any) {
        setTimeout(() => {
            this.SaleForm.get('tambon').patchValue("");
            this.SaleForm.get('zipcode').patchValue("");
        }, 0);
        this.arrobjTown = null;
        if (this.arrobjCity.length > 0) {
            for (let i = 0; i < this.arrobjCity.length; i++) {
                if (this.arrobjCity[i].location_name === event) {
                    const parentID = this.arrobjCity[i].location_id;
                    //getCity
                    const dataTown = 'txt_location_type_id=' + 4 + '&txt_parent_id=' + parentID + '&cur_page=' + 1 + '&per_page=' + 100
                    this.locationService.get(dataTown).subscribe(data => {
                        this.arrobjTown = data.data.dataList;
                    })
                }
            }
        }
    }

    getTownNew(event: any) {
        if (this.arrobjTown.length > 0) {
            for (let i = 0; i < this.arrobjTown.length; i++) {
                if (this.arrobjTown[i].location_name === event) {
                    setTimeout(() => {
                        this.SaleForm.get('tambon').patchValue(this.arrobjTown[i].location_name);
                        this.SaleForm.get('zipcode').patchValue(this.arrobjTown[i].location_postcode);
                    }, 0);
                }
            }
        }

    }

    //edit --------------------------------------------

    getStateEdit() {

        const dataState = 'txt_location_type_id=' + 2 + '&txt_parent_id=' + 231 + '&cur_page=' + 1 + '&per_page=' + 100
        this.locationService.get(dataState).subscribe(data => {
            this.arrobjState = data.data.dataList;
            setTimeout(() => {
                this.SaleForm.get('province').patchValue(this.arrobjRow.sale_rep_addr_province);
            }, 0);
            this.getCityEdit(this.arrobjRow.sale_rep_addr_province, this.arrobjState);
        })

    }
    getCityEdit(str: string, arrstate: any) {
        const strs = str;
        const arrstates = arrstate;
        if (arrstates.length > 0) {
            for (let i = 0; i < arrstates.length; i++) {
                if (arrstates[i].location_name === strs) {
                    const parentID = arrstates[i].location_id;
                    //getCity
                    const dataCity = 'txt_location_type_id=' + 3 + '&txt_parent_id=' + parentID + '&cur_page=' + 1 + '&per_page=' + 100
                    this.locationService.get(dataCity).subscribe(data => {
                        this.arrobjCity = data.data.dataList;
                        setTimeout(() => {
                            this.SaleForm.get('amphoe').patchValue(this.arrobjRow.sale_rep_addr_amphoe);
                        }, 0);
                        this.getTownEdit(this.arrobjRow.sale_rep_addr_amphoe, this.arrobjCity);
                    })
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
                    //getTown
                    const dataTown = 'txt_location_type_id=' + 4 + '&txt_parent_id=' + parentID + '&cur_page=' + 1 + '&per_page=' + 100
                    this.locationService.get(dataTown).subscribe(data => {
                        this.arrobjTown = data.data.dataList;
                        setTimeout(() => {
                            this.SaleForm.get('tambon').patchValue(this.arrobjRow.sale_rep_addr_tambon);
                            this.SaleForm.get('zipcode').patchValue(this.arrobjRow.sale_rep_addr_post);
                        }, 0);
                    })
                }
            }
        }
    }
    //--------------------------------------------


    btnDialogMab() {

        const dialogRef = this.dialogService.open(DialogsMapComponent, {
        });

        dialogRef.onClose.subscribe(result => {
            if (result) {
                console.log(result);

                setTimeout(() => {
                    this.SaleForm.get('sale_rep_addr_full').patchValue(result.address);
                    this.SaleForm.get('sale_rep_addr_number').patchValue(result.num);
                    this.SaleForm.get('province').patchValue('');
                    this.SaleForm.get('amphoe').patchValue('');
                    this.SaleForm.get('tambon').patchValue('');
                    this.SaleForm.get('zipcode').patchValue('');
                    this.SaleForm.get('sale_rep_addr_lat').patchValue(result.supplier_addr_location_lat);
                    this.SaleForm.get('sale_rep_addr_lng').patchValue(result.supplier_addr_location_lng);
                    this.SaleForm.get('latitudeAndLongitude').patchValue(result.supplier_addr_location_lat + ',' + result.supplier_addr_location_lng);
                }, 0);

                this.arrobjRow.sale_rep_addr_address_full = result.address;
                this.arrobjRow.sale_rep_addr_number = result.num;
                this.arrobjRow.sale_rep_addr_tambon = result.town;
                this.arrobjRow.sale_rep_addr_amphoe = result.city;
                this.arrobjRow.sale_rep_addr_province = result.state;
                this.arrobjRow.sale_rep_addr_post = result.zipcode;

                this.getStateEdit();

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

        console.log('btnSaveClick : SaleForm : ', this.SaleForm);
        this.submitted = true;
        if (this.SaleForm.invalid || this.image.update || this.phone.tel.number === "" || this.phone.mobile.number === "") {
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
                sale_rep_name: this.SaleForm.value.sale_rep_company,
                sale_rep_company: this.SaleForm.value.sale_rep_name,
                sale_rep_tag: this.SaleForm.value.sale_rep_tag,
                sale_rep_first_name: this.SaleForm.value.sale_rep_first_name,
                sale_rep_last_name: this.SaleForm.value.sale_rep_last_name,
                sale_rep_email: this.SaleForm.value.sale_rep_email,
                sale_rep_mobile: this.phone.mobile.number,
                sale_rep_tel: this.phone.tel.number,
                sale_rep_addr_full: this.SaleForm.value.sale_rep_addr_full,
                sale_rep_addr_number: this.SaleForm.value.sale_rep_addr_number,
                sale_rep_addr_province: this.SaleForm.value.province,
                sale_rep_addr_amphoe: this.SaleForm.value.amphoe,
                sale_rep_addr_tambon: this.SaleForm.value.tambon,
                sale_rep_addr_post: this.SaleForm.value.zipcode,
                sale_rep_addr_lat: this.SaleForm.value.sale_rep_addr_lat,
                sale_rep_addr_lng: this.SaleForm.value.sale_rep_addr_lng
            }

            const dataJson = JSON.stringify(dataJsons);
            console.log("save : dataJson : ", dataJsons);

            this.saleRepService.postSalerepAccountCreate(dataJson).subscribe(data => {
                this.router.navigate([this.listPage]);
            });
        } else {
            const dataJsons = {
                distributor_id: this.arrobjRow.distributor_id,
                dealer_id: this.arrobjRow.dealer_id,
                sale_rep_id: this.arrobjRow.sale_rep_id,
                sale_rep_image_url: (this.image.main_image.port.length > 0) ? this.image.main_image.port[0].image_url : "-",
                sale_rep_name: this.SaleForm.value.sale_rep_company,
                sale_rep_company: this.SaleForm.value.sale_rep_name,
                sale_rep_tag: this.SaleForm.value.sale_rep_tag,
                sale_rep_first_name: this.SaleForm.value.sale_rep_first_name,
                sale_rep_last_name: this.SaleForm.value.sale_rep_last_name,
                sale_rep_email: this.SaleForm.value.sale_rep_email,
                sale_rep_mobile: this.phone.mobile.number,
                sale_rep_tel: this.phone.tel.number,
                sale_rep_addr_full: this.SaleForm.value.sale_rep_addr_full,
                sale_rep_addr_number: this.SaleForm.value.sale_rep_addr_number,
                sale_rep_addr_province: this.SaleForm.value.province,
                sale_rep_addr_amphoe: this.SaleForm.value.amphoe,
                sale_rep_addr_tambon: this.SaleForm.value.tambon,
                sale_rep_addr_post: this.SaleForm.value.zipcode,
                sale_rep_addr_lat: this.SaleForm.value.sale_rep_addr_lat,
                sale_rep_addr_lng: this.SaleForm.value.sale_rep_addr_lng
            }

            const dataJson = JSON.stringify(dataJsons);
            console.log("save : arrobjRow : ", dataJsons);

            this.saleRepService.postSalerepAccountUpdate(dataJson).subscribe(data => {
                this.router.navigate([this.listPage]);
            });
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
