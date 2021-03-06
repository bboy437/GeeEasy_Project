import { Router, ActivatedRoute } from '@angular/router';
import { SupplierAPIService, UploadAPIService, BrowseSupplierAPIService } from '@project/services';
import { LocationAPIService } from '@project/services';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, NgZone, Input, EventEmitter, Output } from '@angular/core';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
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


    private UrlRouter_Supplier = "suppliers/my-suppliers/list";
    private UrlRouter_SupplierDetail = "suppliers/detail";
    @Input() id: string;
    @Output() closes = new EventEmitter<any>();
    arrobjRow: any = {};
    objAPIResponse: any = {};
    RowID: string;
    Form: FormGroup;
    submitted = false;
    arrCategory: any = [];
    loading = false;
    strCancel: string;
    strSave: string;
    product_category__name: string;
    product_category_root_id: number;

    phones: any;
    mobiles: any;
    isCheckPhone = false;

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
        this.getData();

    }

    getData() {
        const value = this.id_local;
        this.supplierAPIService.getSupID(value).subscribe(data => {
            this.arrobjRow = data.response_data[0];
            console.log(this.arrobjRow);

            if (this.arrobjRow.supplier_image_url !== undefined && this.arrobjRow.supplier_image_url !== "-" && this.arrobjRow.supplier_image_url !== "")
                this.uploadAPIService.uploadImage().getUrl(this.arrobjRow.supplier_image_url, red_image => {
                    this.image.main_image.get.push(red_image);
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


    get f() { return this.Form.controls; }
    onSubmit() {
        this.submitted = true;
        if (this.Form.invalid) {
            return;
        }
    }

    buildForm() {
        this.Form = this.formBuilder.group({
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
            phone: ["", [Validators.minLength(9)]],
            mobile: ["", [Validators.minLength(10)]],
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
        this.Form.patchValue({
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
        console.log(this.Form);
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
                this.Form.get('productcategory').patchValue(Number(this.arrobjRow.product_category_id));
            }, 0);
            this.editForm();
        })
    }

    /*New Data Location ------------------------ */

    changeProvince(location_name) {
        this.Form.get('amphoe').patchValue("");
        this.Form.get('tambon').patchValue("");
        this.Form.get('zipcode').patchValue("");
        this.Form.get('supplier_addr_location_lat').patchValue(0);
        this.Form.get('supplier_addr_location_lng').patchValue(0);
        this.Form.get('latitudeAndLongitude').patchValue(0 + ',' + 0);
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
        this.Form.get('supplier_addr_location_lat').patchValue(0);
        this.Form.get('supplier_addr_location_lng').patchValue(0);
        this.Form.get('latitudeAndLongitude').patchValue(0 + ',' + 0);
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
            this.Form.get('supplier_addr_location_lat').patchValue(0);
            this.Form.get('supplier_addr_location_lng').patchValue(0);
            this.Form.get('latitudeAndLongitude').patchValue(0 + ',' + 0);
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
        }
    }


    btnDialogMab() {

        const dialogRef = this.dialogService.open(DialogsMapComponent, {
        });

        dialogRef.onClose.subscribe(result => {
            if (result) {
                this.Form.get('Address').patchValue(result.address);
                this.Form.get('number').patchValue(result.num);
                this.Form.get('province').patchValue(result.state);
                this.Form.get('amphoe').patchValue(result.city);
                this.Form.get('tambon').patchValue(result.town);
                this.Form.get('zipcode').patchValue(result.zipcode);
                this.Form.get('supplier_addr_location_lat').patchValue(result.supplier_addr_location_lat);
                this.Form.get('supplier_addr_location_lng').patchValue(result.supplier_addr_location_lng);
                this.Form.get('latitudeAndLongitude').patchValue(result.supplier_addr_location_lat + ',' + result.supplier_addr_location_lng);
                this.changeProvinceEdit(result.state, result.city, result.town);

            }
        });
    }

    categoryKeywordEvent(event) {
        if (event.product_category__id !== 0) {
            this.Form.get('catalogkeyword').patchValue(event.product_category__name);
        } else {
            this.Form.get('catalogkeyword').patchValue("");
        }
        console.log('event', event);

    }

    categoryEvent(event) {
        if (event.product_category__id !== 0) {
            if (event.product_category__name === "Other") {
                this.Form.get("productcategory").patchValue(event.product_category__id);
                this.Form.get('product_category_root_id').patchValue(event.product_category_root_id);
                this.Form.get("category_custom_keyword").patchValue("");
            } else {
                this.Form.get("productcategory").patchValue(event.product_category__id);
                this.Form.get('product_category_root_id').patchValue(event.product_category_root_id);
                this.Form.get("category_custom_keyword").patchValue("-");
            }
            this.product_category__name = event.product_category__name;
        } else {
            this.Form.get("productcategory").patchValue("");
            this.Form.get('product_category_root_id').patchValue("");
            this.Form.get("category_custom_keyword").patchValue("-");

            this.product_category__name = event.product_category__name;
        }
        console.log("event", event);
        console.log("product_category__name", this.product_category__name);
    }

    onDataTel(data) {
        this.phones = data;
        if (this.phones.tel.number === "") {
            this.isCheckPhone = true;
        } else {
            this.isCheckPhone = false;
        }
        console.log('phones', this.phones);
    }

    onDataMobilel(data) {
        this.mobiles = data;
        if (this.mobiles.mobile.number === "") {
            this.isCheckPhone = true;
        } else {
            this.isCheckPhone = false;
        }
        console.log('mobiles', this.mobiles);

    }


    btnSaveClick() {

        this.submitted = true;
        if (this.Form.invalid || this.image.update) {
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
        this.loading = true;

        //Edit supplier
        const dataEdit = {
            distributor_id: this.id_local,
            dealer_id: 0,
            sale_rep_id: 0,
            supplier_phone: this.phones.tel.number,
            supplier_addr_phone: this.mobiles.mobile.number,
            supplier_image_url: (this.image.main_image.port.length > 0) ? this.image.main_image.port[0].image_url : "-",
            supplier_id: this.arrobjRow.supplier_id,
            supplier_name: this.Form.value.suppliername,
            product_category_id: this.Form.value.productcategory,
            product_category_root_id: this.Form.value.product_category_root_id,
            supplier_catalog_keyword: this.Form.value.catalogkeyword,
            category_custom_keyword: this.Form.value.category_custom_keyword,
            supplier_keyword: this.Form.value.supplierkeyword,
            supplier_name_first: this.Form.value.firstName,
            supplier_name_last: this.Form.value.lastName,
            supplier_company_name: this.Form.value.companyName,
            supplier_company_contact: this.Form.value.emailAddress,
            supplier_email: this.Form.value.emailAddress,
            // supplier_addr_phone: this.Form.value.phoneNo,
            // distributor_mobile: this.Form.value.mobileNo,
            supplier_addr_full: this.Form.value.Address,
            supplier_addr_number: this.Form.value.number,
            supplier_addr_tambon: this.Form.value.tambon,
            supplier_addr_amphoe: this.Form.value.amphoe,
            supplier_addr_province: this.Form.value.province,
            supplier_addr_postcode: this.Form.value.zipcode,
            supplier_addr_location_lat: this.Form.value.supplier_addr_location_lat,
            supplier_addr_location_lng: this.Form.value.supplier_addr_location_lng
        }
        const dataJson = JSON.stringify(dataEdit)
        console.log('dataEdit', dataEdit);

        this.supplierAPIService.updateSupplier(dataJson).subscribe(data => {
            this.Form.reset();
            this.loading = false;
            this.image.update = false;
            this.getData();
        })


    }

    btnCancelClick() {
        if (this.strCancel == "dialog") {
            this.closes.emit('ok')
        } else {
            this.router.navigate([this.UrlRouter_Supplier]);
        }
    }

    btnBackClick() {
        this.router.navigate([this.UrlRouter_SupplierDetail, this.RowID]);
    }

}
