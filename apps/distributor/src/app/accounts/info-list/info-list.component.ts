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
    Form: FormGroup;
    submitted = false;
    arrCategory: any = [];
    product_category_id: string;
    loading = false;
    isReload = false;
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
        this.getData();
    }

    getData() {
        this.distributorAPIService.getDisDetail(this.id_local).subscribe(data => {
            this.arrobjRow = data.response_data[0];

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

        });
    }

    getCategory() {
        const valueCategory = "cur_page=" + 1 + "&per_page=" + 10;
        this.browseSupplierAPIService
            .getCategoryDist(valueCategory)
            .subscribe(data => {
                this.arrCategory = data.response_data;
                setTimeout(() => {
                    this.Form.get('product_category_id').patchValue(Number(this.arrobjRow.product_category_id));
                }, 0);
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
            distributor_name: ["", Validators.required],
            product_category_id: ["", Validators.required],
            product_category_root_id: [],
            distributor_catalog_keyword: ["", Validators.required],
            distributor_firstname: ["", Validators.required],
            distributor_lastname: ["", Validators.required],
            distributor_email: ["", [Validators.required, Validators.email]],
            phone: ["", [Validators.minLength(9)]],
            mobile: ["", [Validators.minLength(10)]],
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
        this.Form.patchValue({
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
        this.product_category_root_id = +this.arrobjRow.product_category_array[0].product_category_id;
        this.loading = false;
    }

    /*New Data Location ------------------------ */

    changeProvince(location_name) {
        this.Form.get('amphoe').patchValue("");
        this.Form.get('tambon').patchValue("");
        this.Form.get('zipcode').patchValue("");
        this.Form.get('distributor_addr_lat').patchValue(0);
        this.Form.get('distributor_addr_lng').patchValue(0);
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
        this.Form.get('distributor_addr_lat').patchValue(0);
        this.Form.get('distributor_addr_lng').patchValue(0);
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
            this.Form.get('distributor_addr_lat').patchValue(0);
            this.Form.get('distributor_addr_lng').patchValue(0);
            this.Form.get('latitudeAndLongitude').patchValue(0 + ',' + 0);
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
        }
    }

    //--------------------------------------------

    btnDialogMab() {

        const dialogRef = this.dialogService.open(DialogsMapComponent, {
        });

        dialogRef.onClose.subscribe(result => {
            if (result) {
                console.log(result);
                this.Form.get('distributor_addr_full').patchValue(result.address);
                this.Form.get('distributor_addr_number').patchValue(result.num);
                this.Form.get('province').patchValue(result.state);
                this.Form.get('amphoe').patchValue(result.city);
                this.Form.get('tambon').patchValue(result.town);
                this.Form.get('zipcode').patchValue(result.zipcode);
                this.Form.get('distributor_addr_lat').patchValue(result.supplier_addr_location_lat);
                this.Form.get('distributor_addr_lng').patchValue(result.supplier_addr_location_lng);
                this.Form.get('latitudeAndLongitude').patchValue(result.supplier_addr_location_lat + ',' + result.supplier_addr_location_lng);
                this.changeProvinceEdit(result.state, result.city, result.town);

            }

        });
    }

    categoryEvent(event) {
        console.log("event", event);
        if (event.product_category__id !== 0) {
            this.Form.get('product_category_id').patchValue(event.product_category__id);
            this.Form.get('product_category_root_id').patchValue(event.product_category_root_id);
        } else {
            this.Form.get('product_category_id').patchValue("");
            this.Form.get('product_category_root_id').patchValue("");
        }
        console.log('event', event);

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

        console.log('btnSaveClick : Form : ', this.Form);
        this.submitted = true;
        if (this.Form.invalid || this.image.update) {
            return;
        }

        this.image.update = true;
        const dataSend = {
            type_id: 100,
            file_name: "",
            file_type: "",
            supplier_id: this.id_local,
            user_id: 0
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
            distributor_tel: this.phones.tel.number,
            distributor_mobile: this.mobiles.mobile.number,
            distributor_image_url: (this.image.main_image.port.length > 0) ? this.image.main_image.port[0].image_url : "-",
            distributor_name: this.Form.value.distributor_name,
            product_category_id: this.Form.value.product_category_id,
            product_category_root_id: this.Form.value.product_category_root_id,
            distributor_catalog_keyword: this.Form.value.distributor_catalog_keyword,
            distributor_firstname: this.Form.value.distributor_firstname,
            distributor_lastname: this.Form.value.distributor_lastname,
            distributor_email: this.Form.value.distributor_email,
            distributor_addr_full: this.Form.value.distributor_addr_full,
            distributor_addr_number: this.Form.value.distributor_addr_number,
            distributor_addr_tambon: this.Form.value.tambon,
            distributor_addr_amphoe: this.Form.value.amphoe,
            distributor_addr_province: this.Form.value.province,
            distributor_addr_post: this.Form.value.zipcode,
            distributor_addr_lat: this.Form.value.distributor_addr_lat,
            distributor_addr_lng: this.Form.value.distributor_addr_lng
        }
        const dataJson = JSON.stringify(dataEdit);
        console.log("save : arrobjRow : ", dataEdit);

        this.distributorAPIService.updateDistributor(dataJson).subscribe(data => {
            this.Form.reset();
            this.loading = false;
            this.image.update = false;
            this.getData();
        });

    }

    btnCancelClick() {
        this.router.navigate([this.UrlRouter_DistributorsList]);
    }

    btnBackClick() {
        this.router.navigate([this.UrlRouter_DistributorsDetail, this.RowID]);
    }

}
