
import { Router, ActivatedRoute } from '@angular/router';
import { SupplierAPIService, UploadAPIService, BrowseSupplierAPIService } from '@project/services';
import { LocationAPIService } from '@project/services';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, NgZone, Input, EventEmitter, Output } from '@angular/core';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { DialogsMapComponent } from '../../../dialogs/dialogs-map/dialogs-map.component';
import { DialogsCancelComponent } from '../../../dialogs/dialogs-cancel/dialogs-cancel.component';
import { SupplierCreateComponent } from '../../../dialogs/supplier-create/supplier-create.component';

// file service & external data
import JSON_PROVINCE from '../../../../../../../libs/shared/src/lib/json/province.json';
import JSON_LOCATION from '../../../../../../../libs/shared/src/lib/json/location.json';
import JSON_LOCATION_DETAIL from '../../../../../../../libs/shared/src/lib/json/location_detail.json';

@Component({
    selector: 'project-mysupplier-save',
    templateUrl: './mysupplier-save.component.html',
    styleUrls: ['./mysupplier-save.component.scss'],
    providers: [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }]
})
export class MysupplierSaveComponent implements OnInit {

    private UrlRouter_Supplier = "suppliers/my-suppliers/list";
    private UrlRouter_SupplierDetail = "suppliers/detail";
    @Input() id: string;
    @Output() closes = new EventEmitter<any>();
    arrobjRow: any = {};
    objAPIResponse: any = {};
    RowID: string;
    supplierForm: FormGroup;
    submitted = false;
    imagePath: any = [];
    uploadData: any = [];
    arrCategory: any = [];
    imgURL: any;
    public message = "No File chosen";
    loading = false;
    strCancel: string;
    strSave: string;
    product_category__name: string;
    product_category_root_id: number;

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
        private supplierAPIService: SupplierAPIService,
        private locationService: LocationAPIService,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private dialogService: NbDialogService,
        private uploadAPIService: UploadAPIService,
        private browseSupplierAPIService: BrowseSupplierAPIService,

    ) {
        this.id_local = localStorage.getItem('id');
        console.log(' this.id_local', this.id_local);
        this.loading = true;
    }


    ngOnInit() {

        this.buildForm();
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
        if (this.RowID === "new") {
            // this.getCategoryNew();
            this.loading = false;
        } else {
            this.supplierAPIService.getSupID(this.RowID).subscribe(data => {
                this.arrobjRow = data.response_data[0];
                console.log(this.arrobjRow);
                this.imgURL = data.response_data[0].supplier_image_url;
                if (this.arrobjRow.supplier_image_url !== undefined && this.arrobjRow.supplier_image_url !== "-" && this.arrobjRow.supplier_image_url !== "")
                    this.uploadAPIService.uploadImage().getUrl(this.arrobjRow.supplier_image_url, red_image => {
                        this.image.main_image.get.push(red_image);
                    });

                this.phoneNumber().main(_self_ => {
                    data.response_data.forEach(item => {
                        _self_.getNumberArray(item.supplier_phone, getNumberArray => {
                            this.phone.tel.number = item.supplier_phone;
                            this.phone.tel.number_array = getNumberArray;
                        });
                        _self_.getNumberArray(item.supplier_addr_phone, getNumberArray => {
                            this.phone.mobile.number = item.supplier_addr_phone;
                            this.phone.mobile.number_array = getNumberArray;
                        });
                    });
                });

                /*Get Province Edit */
                this.changeProvinceEdit(
                    this.arrobjRow.supplier_addr_province,
                    this.arrobjRow.supplier_addr_amphoe,
                    this.arrobjRow.supplier_addr_tambon
                );

                this.getCategory();
            })
        }
    }


    get f() { return this.supplierForm.controls; }
    onSubmit() {
        this.submitted = true;
        if (this.supplierForm.invalid) {
            return;
        }
    }

    buildForm() {
        this.supplierForm = this.formBuilder.group({
            suppliername: ['', Validators.required],
            productcategory: ['', Validators.required],
            product_category_root_id: [],
            catalogkeyword: ['', Validators.required],
            supplierkeyword: ['', Validators.required],
            category_custom_keyword: ["", Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            companyName: ['', Validators.required],
            emailAddress: ['', [Validators.required, Validators.email]],
            telephoneNumber: [""],
            Address: ['', Validators.required],
            number: ['', Validators.required],
            province: ['', Validators.required],
            amphoe: ['', Validators.required],
            tambon: ['', Validators.required],
            zipcode: ['', Validators.required],
            latitudeAndLongitude: [{ value: '', disabled: true }, Validators.required],
            supplier_addr_location_lat: [],
            supplier_addr_location_lng: []
        });

    }

    editForm() {
        this.supplierForm.patchValue({
            suppliername: this.arrobjRow.supplier_name,
            productcategory: +this.arrobjRow.product_category_array[0].product_category_id,
            category_custom_keyword: this.arrobjRow.category_custom_keyword,
            product_category_root_id: this.arrobjRow.product_category_root_id,
            catalogkeyword: this.arrobjRow.product_category_keyword,
            supplierkeyword: this.arrobjRow.supplier_keyword,
            firstName: this.arrobjRow.supplier_name_first,
            lastName: this.arrobjRow.supplier_name_last,
            companyName: this.arrobjRow.supplier_company_name,
            emailAddress: this.arrobjRow.supplier_company_contact,
            // phoneNo: this.arrobjRow.supplier_addr_phone,
            Address: this.arrobjRow.supplier_addr_full,
            number: this.arrobjRow.supplier_addr_number,
            latitudeAndLongitude: this.arrobjRow.supplier_addr_location_lat + ',' + this.arrobjRow.supplier_addr_location_lng,
            supplier_addr_location_lat: this.arrobjRow.supplier_addr_location_lat,
            supplier_addr_location_lng: this.arrobjRow.supplier_addr_location_lng,
        });
        this.product_category__name = this.arrobjRow.product_category_array[0].product_category_name;

        if (this.arrobjRow.product_category_array.length > 0) {
            this.product_category_root_id = +this.arrobjRow.product_category_array[0].product_category_root_id === 0 ? +this.arrobjRow.product_category_array[0].product_category_id : +this.arrobjRow.product_category_array[0].product_category_root_id;
            //this.product_category_root_id = +this.arrobjRow.product_category_array[0].product_category_id;
        }
        console.log(this.supplierForm);
        this.loading = false;
    }

    getCategoryNew() {
        const valueCategory = 'cur_page=' + 1 + '&per_page=' + 10 + "&distributor_id=" + this.id_local;
        this.browseSupplierAPIService.getCategory(valueCategory).subscribe(data => {
            this.arrCategory = data.response_data;
        })
    }

    getCategory() {
        const valueCategory = 'cur_page=' + 1 + '&per_page=' + 10 + "&distributor_id=" + this.id_local;
        this.browseSupplierAPIService.getCategory(valueCategory).subscribe(data => {
            this.arrCategory = data.response_data;

            setTimeout(() => {
                this.supplierForm.get('productcategory').patchValue(Number(this.arrobjRow.product_category_id));
            }, 0);
            this.editForm();
        })
    }

    /*New Data Location ------------------------ */

    changeProvince(location_name) {
        this.supplierForm.get('amphoe').patchValue("");
        this.supplierForm.get('tambon').patchValue("");
        this.supplierForm.get('zipcode').patchValue("");
        this.supplierForm.get('supplier_addr_location_lat').patchValue(0);
        this.supplierForm.get('supplier_addr_location_lng').patchValue(0);
        this.supplierForm.get('latitudeAndLongitude').patchValue(0 + ',' + 0);
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
        this.supplierForm.get('tambon').patchValue("");
        this.supplierForm.get('zipcode').patchValue("");
        this.supplierForm.get('supplier_addr_location_lat').patchValue(0);
        this.supplierForm.get('supplier_addr_location_lng').patchValue(0);
        this.supplierForm.get('latitudeAndLongitude').patchValue(0 + ',' + 0);
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
            this.supplierForm.get('tambon').patchValue(arrTambon[0].location_name);
            this.supplierForm.get('zipcode').patchValue(arrTambon[0].location_postcode);
            this.supplierForm.get('supplier_addr_location_lat').patchValue(0);
            this.supplierForm.get('supplier_addr_location_lng').patchValue(0);
            this.supplierForm.get('latitudeAndLongitude').patchValue(0 + ',' + 0);
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
            this.supplierForm.get('province').patchValue(strProvince);
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
            this.supplierForm.get('amphoe').patchValue(strAmphoe);
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
            this.supplierForm.get('tambon').patchValue(arrTambon[0].location_name);
            this.supplierForm.get('zipcode').patchValue(arrTambon[0].location_postcode);
        }
    }


    btnDialogMab() {

        const dialogRef = this.dialogService.open(DialogsMapComponent, {
        });

        dialogRef.onClose.subscribe(result => {
            if (result) {
                this.supplierForm.get('Address').patchValue(result.address);
                this.supplierForm.get('number').patchValue(result.num);
                this.supplierForm.get('province').patchValue(result.state);
                this.supplierForm.get('amphoe').patchValue(result.city);
                this.supplierForm.get('tambon').patchValue(result.town);
                this.supplierForm.get('zipcode').patchValue(result.zipcode);
                this.supplierForm.get('supplier_addr_location_lat').patchValue(result.supplier_addr_location_lat);
                this.supplierForm.get('supplier_addr_location_lng').patchValue(result.supplier_addr_location_lng);
                this.supplierForm.get('latitudeAndLongitude').patchValue(result.supplier_addr_location_lat + ',' + result.supplier_addr_location_lng);
                this.changeProvinceEdit(result.state, result.city, result.town);

            }
        });
    }

    categoryKeywordEvent(event) {
        if (event.product_category__id !== 0) {
            this.supplierForm.get('catalogkeyword').patchValue(event.product_category__name);
        } else {
            this.supplierForm.get('catalogkeyword').patchValue("");
        }
        console.log('event', event);

    }

    categoryEvent(event) {
        if (event.product_category__id !== 0) {
            if (event.product_category__name === "Other") {
                this.supplierForm.get("productcategory").patchValue(event.product_category__id);
                this.supplierForm.get('product_category_root_id').patchValue(event.product_category_root_id);
                this.supplierForm.get("category_custom_keyword").patchValue("");
            } else {
                this.supplierForm.get("productcategory").patchValue(event.product_category__id);
                this.supplierForm.get('product_category_root_id').patchValue(event.product_category_root_id);
                this.supplierForm.get("category_custom_keyword").patchValue("-");
            }
            this.product_category__name = event.product_category__name;
        } else {
            this.supplierForm.get("productcategory").patchValue("");
            this.supplierForm.get('product_category_root_id').patchValue("");
            this.supplierForm.get("category_custom_keyword").patchValue("-");

            this.product_category__name = event.product_category__name;
        }
        console.log("event", event);
        console.log("product_category__name", this.product_category__name);
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

        this.submitted = true;
        if (this.supplierForm.invalid || this.image.update || this.phone.tel.number === "" || this.phone.mobile.number === "") {
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
            //New supplier
            const dataNew = {
                distributor_id: this.id_local,
                dealer_id: 0,
                sale_rep_id: 0,
                supplier_phone: this.phone.tel.number,
                supplier_addr_phone: this.phone.mobile.number,
                supplier_image_url: (this.image.main_image.port.length > 0) ? this.image.main_image.port[0].image_url : "-",
                supplier_name: this.supplierForm.value.suppliername,
                product_category_id: this.supplierForm.value.productcategory,
                product_category_root_id: this.supplierForm.value.product_category_root_id,
                supplier_catalog_keyword: this.supplierForm.value.catalogkeyword,
                supplier_keyword: this.supplierForm.value.supplierkeyword,
                category_custom_keyword: this.supplierForm.value.category_custom_keyword,
                supplier_name_first: this.supplierForm.value.firstName,
                supplier_name_last: this.supplierForm.value.lastName,
                supplier_company_name: this.supplierForm.value.companyName,
                supplier_company_contact: this.supplierForm.value.emailAddress,
                supplier_email: this.supplierForm.value.emailAddress,
                // supplier_addr_phone: this.supplierForm.value.phoneNo,
                // distributor_mobile: this.supplierForm.value.mobileNo,
                supplier_addr_full: this.supplierForm.value.Address,
                supplier_addr_number: this.supplierForm.value.number,
                supplier_addr_tambon: this.supplierForm.value.tambon,
                supplier_addr_amphoe: this.supplierForm.value.amphoe,
                supplier_addr_province: this.supplierForm.value.province,
                supplier_addr_postcode: this.supplierForm.value.zipcode,
                supplier_addr_location_lat: this.supplierForm.value.supplier_addr_location_lat,
                supplier_addr_location_lng: this.supplierForm.value.supplier_addr_location_lng
            }
            const dataJson = JSON.stringify(dataNew)
            console.log(dataNew);

            this.supplierAPIService.addSupplier(dataJson).subscribe(data => {
                // tslint:disable-next-line: triple-equals
                if (this.strSave == "dialog") {
                    this.closes.emit('ok')
                } else {
                    this.router.navigate([this.UrlRouter_Supplier]);
                }
            })

        } else {

            //Edit supplier
            const dataEdit = {
                distributor_id: this.id_local,
                dealer_id: 0,
                sale_rep_id: 0,
                supplier_phone: this.phone.tel.number,
                supplier_addr_phone: this.phone.mobile.number,
                supplier_image_url: (this.image.main_image.port.length > 0) ? this.image.main_image.port[0].image_url : "-",
                supplier_id: this.arrobjRow.supplier_id,
                supplier_name: this.supplierForm.value.suppliername,
                product_category_id: this.supplierForm.value.productcategory,
                product_category_root_id: this.supplierForm.value.product_category_root_id,
                supplier_catalog_keyword: this.supplierForm.value.catalogkeyword,
                category_custom_keyword: this.supplierForm.value.category_custom_keyword,
                supplier_keyword: this.supplierForm.value.supplierkeyword,
                supplier_name_first: this.supplierForm.value.firstName,
                supplier_name_last: this.supplierForm.value.lastName,
                supplier_company_name: this.supplierForm.value.companyName,
                supplier_company_contact: this.supplierForm.value.emailAddress,
                supplier_email: this.supplierForm.value.emailAddress,
                // supplier_addr_phone: this.supplierForm.value.phoneNo,
                // distributor_mobile: this.supplierForm.value.mobileNo,
                supplier_addr_full: this.supplierForm.value.Address,
                supplier_addr_number: this.supplierForm.value.number,
                supplier_addr_tambon: this.supplierForm.value.tambon,
                supplier_addr_amphoe: this.supplierForm.value.amphoe,
                supplier_addr_province: this.supplierForm.value.province,
                supplier_addr_postcode: this.supplierForm.value.zipcode,
                supplier_addr_location_lat: this.supplierForm.value.supplier_addr_location_lat,
                supplier_addr_location_lng: this.supplierForm.value.supplier_addr_location_lng
            }
            const dataJson = JSON.stringify(dataEdit)
            console.log('dataEdit', dataEdit);

            this.supplierAPIService.updateSupplier(dataJson).subscribe(data => {
                this.router.navigate([this.UrlRouter_Supplier]);
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
                // tslint:disable-next-line: triple-equals
                if (this.strCancel == "dialog") {
                    this.closes.emit('ok')
                } else {
                    this.router.navigate([this.UrlRouter_Supplier]);
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
                this.router.navigate([this.UrlRouter_SupplierDetail, this.RowID]);
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
        console.log(event[0]);
        this.upload()
    }

    upload() {
        const dataJson = {
            type_id: 200,
            file_name: this.imagePath.name,
            file_type: this.imagePath.type,
            supplier_id: 13356,
            distributor_id: 0
        }

        this.uploadAPIService.uploadImg(JSON.stringify(dataJson)).subscribe(res => {
            console.log(res);
            this.uploadData = res.response_data[0];

            this.uploadAPIService.uploadPut(this.uploadData.file_upload_url, this.imagePath).subscribe(res1 => {
                console.log(res1);
                this.arrobjRow.supplier_image_url = this.uploadData.file_url;
                console.log(this.arrobjRow.supplier_image_url);
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
