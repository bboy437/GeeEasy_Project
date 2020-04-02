import { Router, ActivatedRoute } from "@angular/router";
import {
    DistributorAPIService,
    UploadAPIService,
    BrowseSupplierAPIService,
    SaleRepService, SellerService, RetailAccountService
} from "@project/services";
import { LocationAPIService } from "@project/services";
import {
    FormGroup,
    FormBuilder,
    Validators,
} from "@angular/forms";
import {
    Component,
    OnInit,
} from "@angular/core";
import { NbDialogService } from "@nebular/theme";
import { DialogsMapComponent } from "../../../dialogs/dialogs-map/dialogs-map.component";
import { DialogsCancelComponent } from "../../../dialogs/dialogs-cancel/dialogs-cancel.component";

// file service & external data
import JSON_PROVINCE from '../../../../../../../libs/shared/src/lib/json/province.json';
import JSON_LOCATION from '../../../../../../../libs/shared/src/lib/json/location.json';
import JSON_LOCATION_DETAIL from '../../../../../../../libs/shared/src/lib/json/location_detail.json';

@Component({
    selector: "project-retailer-create",
    templateUrl: "./retailer-create.component.html",
    styleUrls: ["./retailer-create.component.scss"]
})

export class RetailerCreateComponent implements OnInit {
    private listPage = "retailers/retailer/list";
    private detailPage = "retailers/retailer/detail";

    arrobjRow: any = {};
    objAPIResponse: any = {};
    RowID: string;
    SaleForm: FormGroup;
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

    image = {
        update: false,
        main_image: {
            get: [],
            port: []
        }
    }

    arrProvince: any[] = JSON_PROVINCE;
    arrAmphoe: any[];
    arrTambon: any[];
    arrLocation: any[] = JSON_LOCATION;
    arrLocationDetail: any[] = JSON_LOCATION_DETAIL;


    id_local: string;


    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private dialogService: NbDialogService,
        private uploadAPIService: UploadAPIService,
        private browseSupplierAPIService: BrowseSupplierAPIService,
        private retailAccountService: RetailAccountService,
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
                this.imgURL = res.response_data[0].retail_image_url;

                if (this.arrobjRow.retail_image_url !== undefined && this.arrobjRow.retail_image_url !== "-" && this.arrobjRow.retail_image_url !== "")
                    this.uploadAPIService.uploadImage().getUrl(this.arrobjRow.retail_image_url, red_image => {
                        this.image.main_image.get.push(red_image);
                    });

                console.log("ngOnInit : res : ", res);

                /*Get Province Edit */
                this.changeProvinceEdit(
                    this.arrobjRow.retail_addr_province,
                    this.arrobjRow.retail_addr_amphoe,
                    this.arrobjRow.retail_addr_tambon
                );

                /*Value Data Form */
                this.editForm();

                this.phoneNumber().main(_self_ => {
                    res.response_data.forEach(item => {
                        _self_.getNumberArray(item.retail_tel, getNumberArray => {
                            this.phone.tel.number = item.retail_tel;
                            this.phone.tel.number_array = getNumberArray;
                        });
                        _self_.getNumberArray(item.retail_mobile, getNumberArray => {
                            this.phone.mobile.number = item.retail_mobile;
                            this.phone.mobile.number_array = getNumberArray;
                        });
                    });
                });
                this.loading = false;
            })
        }
    }

    clickUpdateOrNew() {
        if (this.loading)
            return
        this.btnSaveClick();
    }

    clickCancelOrBack() {
        switch (this.RowID) {
            case 'new':
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
        this.retailAccountService.getRetailAccountDetail(this.RowID).subscribe(res => {
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
            salerepcompany: ["", Validators.required],
            firstName: ["", Validators.required],
            lastName: ["", Validators.required],
            emailAddress: ["", [Validators.required, Validators.email]],
            telephoneNumber: [""],
            Address: ["", Validators.required],
            number: ["", Validators.required],
            province: ['', Validators.required],
            amphoe: ['', Validators.required],
            tambon: ['', Validators.required],
            zipcode: ["", Validators.required],
            location_lat: [],
            location_lng: [],
            location_lat_location_lng: [{ value: '', disabled: true }, Validators.required],
        });
    }

    editForm() {
        this.SaleForm.patchValue({
            warehouseName: this.arrobjRow.warehouse_name,
            salename: this.arrobjRow.retail_name,
            salerepcompany: this.arrobjRow.retail_company,
            firstName: this.arrobjRow.retail_first_name,
            lastName: this.arrobjRow.retail_last_name,
            emailAddress: this.arrobjRow.retail_email,
            telephoneNumber: this.phone.tel.input,
            Address: this.arrobjRow.retail_addr_full,
            number: this.arrobjRow.retail_addr_number,
            province: this.arrobjRow.retail_addr_province,
            amphoe: this.arrobjRow.retail_addr_amphoe,
            tambon: this.arrobjRow.retail_addr_tambon,
            zipcode: this.arrobjRow.retail_addr_post,
            location_lat: this.arrobjRow.retail_addr_lat,
            location_lng: this.arrobjRow.retail_addr_lng,
            location_lat_location_lng: this.arrobjRow.retail_addr_lat + ',' + this.arrobjRow.retail_addr_lng,
        });
    }

    /*New Data Location ------------------------ */

    changeProvince(location_name) {

        setTimeout(() => {
            this.SaleForm.get('amphoe').patchValue("");
            this.SaleForm.get('tambon').patchValue("");
            this.SaleForm.get('zipcode').patchValue("");
            this.SaleForm.get('location_lat').patchValue(0);
            this.SaleForm.get('location_lng').patchValue(0);
            this.SaleForm.get('location_lat_location_lng').patchValue(0 + ',' + 0);
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
            this.SaleForm.get('tambon').patchValue("");
            this.SaleForm.get('zipcode').patchValue("");
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
                        this.SaleForm.get('tambon').patchValue(this.arrTambon[i].location_name);
                        this.SaleForm.get('zipcode').patchValue(this.arrTambon[i].location_postcode);
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
                        this.SaleForm.get('tambon').patchValue(this.arrTambon[i].location_name);
                        this.SaleForm.get('zipcode').patchValue(this.arrTambon[i].location_postcode);
                    }, 0);
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
                    this.SaleForm.get('Address').patchValue(result.address);
                    this.SaleForm.get('number').patchValue(result.num);
                    this.SaleForm.get('province').patchValue(result.state);
                    this.SaleForm.get('amphoe').patchValue(result.city);
                    this.SaleForm.get('tambon').patchValue(result.town);
                    this.SaleForm.get('zipcode').patchValue(result.zipcode);
                    this.SaleForm.get('location_lat').patchValue(result.supplier_addr_location_lat);
                    this.SaleForm.get('location_lng').patchValue(result.supplier_addr_location_lng);
                    this.SaleForm.get('location_lat_location_lng').patchValue(result.supplier_addr_location_lat + ',' + result.supplier_addr_location_lng);
                }, 0);

                this.changeProvinceEdit(result.state, result.city, result.town);

            }

        });
    }

    uploadImage() {
        let self = this;
        const _function = {
            consoleLog(_function, _title, _data) {
                let _self = this;
                console.log(_function, " : ", _title, " : ", _data);
            },
            postImage(_image, callback: (res) => any) {
                let _self = this;
                const dataSend = {
                    type_id: 640,
                    file_name: _image.name,
                    file_type: _image.type,
                    dealer_id: self.id_local,
                    retail_id: 0
                };
                self.uploadAPIService.uploadImg(JSON.stringify(dataSend)).subscribe(res => {
                    res.response_data.forEach(item => {
                        self.uploadAPIService.uploadPut(item.file_upload_url, _image.event).subscribe(uploadPut => {
                            callback(res);
                        });
                    });
                });
            },
            getImageArray(image_url_array, callback: (res) => any) {
                let _self = this;
                _self.consoleLog("getProductImageArray", "image_url_array", image_url_array);
                let image_array = [];
                if (image_url_array.length === 0)
                    callback(image_array);
                image_url_array.forEach(item => {
                    let image = {
                        image_url: item.result
                    };
                    if (item.name !== "") {
                        _self.postImage(item, res => {
                            _self.consoleLog("getProductImageArray", "res", res);
                            res.response_data.forEach(item => {
                                image.image_url = item.file_url;
                                image_array.push(image);
                                if (image_url_array.length === image_array.length)
                                    callback(image_array);
                            });
                        });
                    } else {
                        image_array.push(image);
                        if (image_url_array.length === image_array.length)
                            callback(image_array);
                    }
                });
            }
        };
        return _function;
    };

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
        if (this.SaleForm.invalid || this.image.update || this.phone.tel.number === "" || this.phone.mobile.number === "")
            return;


        this.image.update = true;
        const dataSend = {
            type_id: 640,
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
        if (this.RowID === "new") {
            const dataSend = {
                "dealer_id": this.id_local,
                "distributor_id": 0,
                "supplier_id": 0,
                "group_id": 0,
                "user_id": 0,
                "retail_name": this.SaleForm.value.salename,
                "retail_first_name": this.SaleForm.value.firstName,
                "retail_last_name": this.SaleForm.value.lastName,
                "retail_tel": this.phone.tel.number,
                "retail_mobile": this.phone.mobile.number,
                "retail_email": this.SaleForm.value.emailAddress,
                "retail_tag": "-",
                "retail_company": this.SaleForm.value.salerepcompany,
                "retail_company_addr": "-",
                "retail_addr_full": this.SaleForm.value.Address,
                "retail_addr_number": this.SaleForm.value.number,
                "retail_addr_tambon": this.SaleForm.value.tambon,
                "retail_addr_amphoe": this.SaleForm.value.amphoe,
                "retail_addr_province": this.SaleForm.value.province,
                "retail_addr_post": this.SaleForm.value.zipcode,
                "retail_addr_lat": this.SaleForm.value.location_lat,
                "retail_addr_lng": this.SaleForm.value.location_lng,
                "retail_image_url": (this.image.main_image.port.length > 0) ? this.image.main_image.port[0].image_url : "-",
                "retail_image_array": []
            };
            // console.log("save : dataSend : ", dataSend);
            const dataSendApi = JSON.stringify(dataSend);
            // console.log("save : dataSendApi : ", dataSendApi);
            this.retailAccountService.postRetailAccountCreate(dataSendApi).subscribe(res => {
                this.router.navigate([this.listPage]);
            });
        } else {
            const dataSend = {
                "retail_id": this.arrobjRow.retail_id,
                "distributor_id": this.arrobjRow.retail_id,
                "supplier_id": this.arrobjRow.supplier_id,
                "group_id": this.arrobjRow.group_id,
                "user_id": this.arrobjRow.user_id,
                "retail_name": this.SaleForm.value.salename,
                "retail_first_name": this.SaleForm.value.firstName,
                "retail_last_name": this.SaleForm.value.lastName,
                "retail_tel": this.phone.tel.number,
                "retail_mobile": this.phone.mobile.number,
                "retail_email": this.SaleForm.value.emailAddress,
                "retail_tag": this.arrobjRow.retail_tag,
                "retail_company": this.SaleForm.value.salerepcompany,
                "retail_company_addr": this.arrobjRow.retail_company_addr,
                "retail_addr_full": this.SaleForm.value.Address,
                "retail_addr_number": this.SaleForm.value.number,
                "retail_addr_tambon": this.SaleForm.value.tambon,
                "retail_addr_amphoe": this.SaleForm.value.amphoe,
                "retail_addr_province": this.SaleForm.value.province,
                "retail_addr_post": this.SaleForm.value.zipcode,
                "retail_addr_lat": this.SaleForm.value.location_lat,
                "retail_addr_lng": this.SaleForm.value.location_lng,
                "retail_image_url": (this.image.main_image.port.length > 0) ? this.image.main_image.port[0].image_url : "-",
                "retail_image_array": []
            };
            // console.log("save : dataSend : ", dataSend);
            const dataSendApi = JSON.stringify(dataSend);
            // console.log("save : dataSendApi : ", dataSendApi);
            this.retailAccountService.postRetailAccountUpdate(dataSendApi).subscribe(data => {
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
            type_id: 640,
            file_name: this.imagePath.name,
            file_type: this.imagePath.type,
            dealer_id: this.id_local,
            retail_id: 0
        };

        this.uploadAPIService.uploadImg(JSON.stringify(dataJson)).subscribe(res => {
            console.log(res);
            this.uploadData = res.response_data[0];

            this.uploadAPIService
                .uploadPut(this.uploadData.file_upload_url, this.imagePath)
                .subscribe(res1 => {
                    console.log(res1);
                    this.arrobjRow.retail_image_url = this.uploadData.file_url;
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
