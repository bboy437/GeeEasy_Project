import { Router, ActivatedRoute } from "@angular/router";
import {
    DistributorAPIService,
    UploadAPIService,
    BrowseSupplierAPIService,
    SaleRepService, SellerService
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
import { DialogsMapComponent } from "../../../dialogs/dialogs-map/dialogs-map.component";
import { DialogsCancelComponent } from "../../../dialogs/dialogs-cancel/dialogs-cancel.component";
// service & obser
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// file service & external data
import JSON_PROVINCE from '../../../../../../../libs/shared/src/lib/json/province.json';
import JSON_LOCATION from '../../../../../../../libs/shared/src/lib/json/location.json';
import JSON_LOCATION_DETAIL from '../../../../../../../libs/shared/src/lib/json/location_detail.json';

@Component({
    selector: "project-seller-create",
    templateUrl: "./seller-create.component.html",
    styleUrls: ["./seller-create.component.scss"]
})

export class SellerCreateComponent implements OnInit {
    private listPage = "team/seller/list";
    private detailPage = "team/seller/detail";
    arrobjRow: any = {};
    RowID: string;
    Form: FormGroup;
    submitted = false;
    loading = false;
    isReload = false;

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
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private dialogService: NbDialogService,
        private uploadAPIService: UploadAPIService,
        private sellerService: SellerService,
    ) {
        this.id_local = localStorage.getItem('id');
        console.log(' this.id_local', this.id_local);
        this.loading = true;
    }

    ngOnInit() {

        this.Builder();
        const params = this.route.snapshot.paramMap;
        this.RowID = params.get("id");

        if (this.RowID === "new") {
            this.loading = false;
        } else {

            this.sellerService.dataSeller$.subscribe(res => {
                res ? this.getData(res) : this.router.navigate([this.listPage]);
            })
        }
    }

    getData(data) {

        this.arrobjRow = data.response_data[0];
        if (this.arrobjRow.user_image_url !== undefined && this.arrobjRow.user_image_url !== "-" && this.arrobjRow.user_image_url !== "")
            this.uploadAPIService.uploadImage().getUrl(this.arrobjRow.user_image_url, red_image => {
                this.image.main_image.get.push(red_image);
            });

        /*Get Province Edit */
        this.changeProvinceEdit(
            this.arrobjRow.user_addr_province,
            this.arrobjRow.user_addr_amphoe,
            this.arrobjRow.user_addr_tambon
        );

        /*Value Data Form */
        this.editForm();
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

    get f() {
        return this.Form.controls;
    }
    onSubmit() {
        this.submitted = true;
        if (this.Form.invalid) {
            return;
        }
    }

    Builder() {
        this.Form = this.formBuilder.group({
            user_name: ['', Validators.required],
            user_company: ['', Validators.required],
            user_tag: ['', Validators.required],
            user_first_name: ['', Validators.required],
            user_last_name: ['', Validators.required],
            user_email: ['', [Validators.required, Validators.email]],
            phone: ["", [Validators.minLength(9)]],
            mobile: ["", [Validators.minLength(10)]],
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
        this.Form.patchValue({
            user_name: this.arrobjRow.user_name,
            user_company: this.arrobjRow.user_company,
            user_tag: this.arrobjRow.user_tag,
            user_first_name: this.arrobjRow.user_first_name,
            user_last_name: this.arrobjRow.user_last_name,
            user_email: this.arrobjRow.user_email,
            addressFull: this.arrobjRow.user_addr_full,
            addressNo: this.arrobjRow.user_addr_number,
            province: this.arrobjRow.user_addr_province,
            amphoe: this.arrobjRow.user_addr_amphoe,
            tambon: this.arrobjRow.warehouse_addr_tambon,
            zipcode: this.arrobjRow.user_addr_tambon,
            location_lat: this.arrobjRow.user_addr_lat,
            location_lng: this.arrobjRow.user_addr_lng,
            location_lat_location_lng: this.arrobjRow.user_addr_lat + ',' + this.arrobjRow.user_addr_lng,
        });
        this.loading = false;
    }

    /*New Data Location ------------------------ */

    changeLocation(data) {
        console.log(data);
        if (data.name === "Province") {
            this.changeProvince(data.location_name)
        }
        if (data.name === "Amphoe") {
            this.changeAmphoe(data.location_name)
        }
        if (data.name === "Tambon") {
            this.changeTambon(data.location_name)
        }

    }

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
        if (this.Form.invalid || this.image.update)
            return;

        this.image.update = true;
        const dataSend = {
            type_id: 600,
            file_name: "",
            file_type: "",
            dealer_id: this.id_local,
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
                "dealer_id": this.id_local,
                "distributor_id": 0,
                "supplier_id": 0,
                "group_id": 0,
                "user_parent_id": 0,
                "user_name": this.Form.value.user_name,
                "user_first_name": this.Form.value.user_first_name,
                "user_last_name": this.Form.value.user_last_name,
                "user_tel": this.phones.tel.number,
                "user_mobile": this.mobiles.mobile.number,
                "user_email": this.Form.value.user_email,
                "user_tag": this.Form.value.user_tag,
                "user_company": this.Form.value.user_company,
                "user_company_addr": this.Form.value.addressFull,
                "user_addr_full": this.Form.value.addressFull,
                "user_addr_number": this.Form.value.addressNo,
                "user_addr_tambon": this.Form.value.tambon,
                "user_addr_amphoe": this.Form.value.amphoe,
                "user_addr_province": this.Form.value.province,
                "user_addr_post": this.Form.value.zipcode,
                "user_addr_lat": this.Form.value.location_lat,
                "user_addr_lng": this.Form.value.location_lng,
                "user_image_url": (this.image.main_image.port.length > 0) ? this.image.main_image.port[0].image_url : "-"
            }

            console.log("save : dataJson : ", dataJson);
            this.sellerService.postSellerCreate(JSON.stringify(dataJson)).subscribe(data => {
                this.Form.reset();
                this.router.navigate([this.listPage]);

            });
        } else {

            const dataJson = {
                "dealer_id": this.arrobjRow.dealer_id,
                "user_parent_id": this.arrobjRow.user_parent_id,
                "group_id": this.arrobjRow.group_id,
                "user_id": this.arrobjRow.user_id,
                "user_name": this.Form.value.user_name,
                "user_first_name": this.Form.value.user_first_name,
                "user_last_name": this.Form.value.user_last_name,
                "user_tel": this.phones.tel.number,
                "user_mobile": this.mobiles.mobile.number,
                "user_email": this.Form.value.user_email,
                "user_tag": this.Form.value.user_tag,
                "user_company": this.Form.value.user_company,
                "user_company_addr": this.Form.value.addressFull,
                "user_addr_full": this.Form.value.addressFull,
                "user_addr_number": this.Form.value.addressNo,
                "user_addr_tambon": this.Form.value.tambon,
                "user_addr_amphoe": this.Form.value.amphoe,
                "user_addr_province": this.Form.value.province,
                "user_addr_post": this.Form.value.zipcode,
                "user_addr_lat": this.Form.value.location_lat,
                "user_addr_lng": this.Form.value.location_lng,
                "user_image_url": (this.image.main_image.port.length > 0) ? this.image.main_image.port[0].image_url : "-"
            }

            console.log("edit : dataJson : ", dataJson);

            this.sellerService.postSellerUpdate(JSON.stringify(dataJson)).subscribe(data => {
                this.Form.reset();
                this.router.navigate([this.listPage]);
            });
        }

    }

    btnCancelClick() {
        this.router.navigate([this.listPage]);
    }

    btnBackClick() {
        this.router.navigate([this.detailPage, this.RowID, 'seller']);
    }


}
