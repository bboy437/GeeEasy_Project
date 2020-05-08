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
    Form: FormGroup;
    RowID: string;
    submitted = false;
    arrobjRow: any = [];
    loading = false;
    imgURL: any;
    public message = "No File chosen";
    imagePath: any = [];
    uploadData: any = [];
    warehouse_image_url: string;

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

        //Check Params ID
        if (params.get("id")) {
            this.RowID = params.get("id");
        } else {
            this.RowID = this.id;
            this.strSave = "dialog";
            this.strCancel = "dialog";
        }

        //Check for new or update
        if (this.RowID === "new") {
            this.loading = false;
        } else {
            this.warehouseAPIService.werehouseDetail$.subscribe(res => {
                res ? this.getData(res) : this.router.navigate([this.UrlRouter_List]);

            })
        }
    }

    getData(data) {
        this.arrobjRow = data.response_data[0];
        console.log(this.arrobjRow);
        this.imgURL = data.response_data[0].warehouse_image_url;
        this.warehouse_image_url = data.response_data[0].warehouse_image_url;

        if (this.arrobjRow.warehouse_image_url !== undefined && this.arrobjRow.warehouse_image_url !== "-" && this.arrobjRow.warehouse_image_url !== "")
            this.uploadAPIService.uploadImage().getUrl(this.arrobjRow.warehouse_image_url, red_image => {
                this.image.main_image.get.push(red_image);
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
    }

    Builder() {
        this.Form = this.fb.group({
            warehouseName: ['', Validators.required],
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
            warehouseName: this.arrobjRow.warehouse_name,
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

    get f() { return this.Form.controls; }
    onSubmit() {
        this.submitted = true;
        if (this.Form.invalid) {
            return;
        }
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

    clickLocation(event) {
        console.log('event', event)
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
        this.RowID = this.RowID
        this.submitted = true;
        if (this.Form.invalid || this.image.update) {
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
                "dealer_id": this.id_local,
                "warehouse_type_id": 3,
                "image_url": (this.image.main_image.port.length > 0) ? this.image.main_image.port[0].image_url : "-",
                "name": this.Form.value.warehouseName,
                "tel": this.phones.tel.number,
                "mobile": this.mobiles.mobile.number,
                "addr_address_full": this.Form.value.addressFull,
                "addr_number": this.Form.value.addressNo,
                "addr_province": this.Form.value.province,
                "addr_amphoe": this.Form.value.amphoe,
                "addr_tambon": this.Form.value.tambon,
                "addr_post": this.Form.value.zipcode,
                "location_lat": this.Form.value.location_lat,
                "location_lng": this.Form.value.location_lng,
            }
            console.log('dataJson', dataJson);
            this.warehouseAPIService.addWarehouse(JSON.stringify(dataJson)).subscribe(data => {
                this.Form.reset();
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
                "dealer_id": this.id_local,
                "warehouse_type_id": 3,
                "image_url": (this.image.main_image.port.length > 0) ? this.image.main_image.port[0].image_url : "-",
                "name": this.Form.value.warehouseName,
                "tel": this.phones.tel.number,
                "mobile": this.mobiles.mobile.number,
                "addr_address_full": this.Form.value.addressFull,
                "addr_number": this.Form.value.addressNo,
                "addr_province": this.Form.value.province,
                "addr_amphoe": this.Form.value.amphoe,
                "addr_tambon": this.Form.value.tambon,
                "addr_post": this.Form.value.zipcode,
                "location_lat": this.Form.value.location_lat,
                "location_lng": this.Form.value.location_lng,
            }
            console.log(dataJson);
            console.log(JSON.stringify(dataJson));
            this.warehouseAPIService.updateWarehouse(JSON.stringify(dataJson)).subscribe(data => {
                console.log(data);
                this.Form.reset();
                this.router.navigate([this.UrlRouter_List]);
            })
        }

    }

    btnCancelClick() {
        if (this.strCancel == "dialog") {
            this.closes.emit('ok')
        } else {
            this.router.navigate([this.UrlRouter_List]);
        }

    }

    btnBackClick() {
        this.router.navigate([this.UrlRouter_Detail, this.RowID]);
    }


}
