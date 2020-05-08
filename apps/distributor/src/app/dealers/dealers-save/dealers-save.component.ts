import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocationAPIService, UploadAPIService } from '@project/services';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DealerAPIService } from '@project/services';
import { NbDialogService } from '@nebular/theme';
import { DialogsMapComponent } from '../../dialogs/dialogs-map/dialogs-map.component';
import { DialogsCancelComponent } from '../../dialogs/dialogs-cancel/dialogs-cancel.component';

// file service & external data
import JSON_PROVINCE from '../../../../../../libs/shared/src/lib/json/province.json';
import JSON_LOCATION from '../../../../../../libs/shared/src/lib/json/location.json';
import JSON_LOCATION_DETAIL from '../../../../../../libs/shared/src/lib/json/location_detail.json';

@Component({
    selector: 'project-dealers-save',
    templateUrl: './dealers-save.component.html',
    styleUrls: ['./dealers-save.component.scss']
})
export class DealersSaveComponent implements OnInit {

    private UrlRouter_DealersList = "dealers/list";
    private UrlRouter_DealersDetail = "dealers/detail";
    arrobjRow: any = {};
    objAPIResponse: any = {};
    RowID: string;
    Form: FormGroup;
    submitted = false;
    loading = false;


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
        private locationService: LocationAPIService,
        private route: ActivatedRoute,
        private dealerAPIService: DealerAPIService,
        private formBuilder: FormBuilder,
        private dialogService: NbDialogService,
        private uploadAPIService: UploadAPIService,
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
            this.loading = false;
        } else {
            this.dealerAPIService.detailDealer$.subscribe(res => {
                res ? this.getData(res) : this.router.navigate([this.UrlRouter_DealersList]);

            })
        }

    }

    getData(data) {
        this.arrobjRow = data.response_data[0];

        if (this.arrobjRow.dealer_image_url !== undefined && this.arrobjRow.dealer_image_url !== "-" && this.arrobjRow.dealer_image_url !== "")
            this.uploadAPIService.uploadImage().getUrl(this.arrobjRow.dealer_image_url, red_image => {
                this.image.main_image.get.push(red_image);
            });

        console.log(this.arrobjRow)

        this.changeProvinceEdit(
            this.arrobjRow.dealer_addr_province,
            this.arrobjRow.dealer_addr_amphoe,
            this.arrobjRow.dealer_addr_tambon);

        this.editForm();
    }

    buildForm() {
        this.Form = this.formBuilder.group({
            dealersName: ['', Validators.required],
            productcategory: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            companyName: ['', Validators.required],
            emailAddress: ['', [Validators.required, Validators.email]],
            phone: ["", [Validators.minLength(9)]],
            mobile: ["", [Validators.minLength(10)]],
            addressFull: ['', Validators.required],
            addressNo: ['', Validators.required],
            province: ['', Validators.required],
            amphoe: ['', Validators.required],
            tambon: ['', Validators.required],
            zipcode: ['', Validators.required],
            latitudeAndLongitude: [{ value: '', disabled: true }, Validators.required],
            dealer_addr_lng: [],
            dealer_addr_lat: []
        });

    }

    editForm() {
        this.Form.patchValue({
            dealersName: this.arrobjRow.dealer_name,
            productcategory: this.arrobjRow.dealer_tag,
            firstName: this.arrobjRow.dealer_first_name,
            lastName: this.arrobjRow.dealer_last_name,
            companyName: this.arrobjRow.dealer_company,
            emailAddress: this.arrobjRow.dealer_email,
            addressFull: this.arrobjRow.dealer_addr_full,
            addressNo: this.arrobjRow.dealer_addr_number,
            province: this.arrobjRow.dealer_addr_province,
            amphoe: this.arrobjRow.dealer_addr_amphoe,
            tambon: this.arrobjRow.dealer_addr_tambon,
            zipcode: this.arrobjRow.dealer_addr_post,
            latitudeAndLongitude: this.arrobjRow.dealer_addr_lat + ',' + this.arrobjRow.dealer_addr_lng,
            dealer_addr_lat: this.arrobjRow.dealer_addr_lat,
            dealer_addr_lng: this.arrobjRow.dealer_addr_lng,
        });
        console.log(this.Form.value)
        this.loading = false;
    }

    /*New Data Location ------------------------ */

    changeProvince(location_name) {
        this.Form.get('amphoe').patchValue("");
        this.Form.get('tambon').patchValue("");
        this.Form.get('zipcode').patchValue("");
        this.Form.get('dealer_addr_lat').patchValue(0);
        this.Form.get('dealer_addr_lng').patchValue(0);
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
        this.Form.get('dealer_addr_lat').patchValue(0);
        this.Form.get('dealer_addr_lng').patchValue(0);
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
            this.Form.get('dealer_addr_lat').patchValue(0);
            this.Form.get('dealer_addr_lng').patchValue(0);
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

                this.Form.get('addressFull').patchValue(result.address);
                this.Form.get('addressNo').patchValue(result.num);
                this.Form.get('province').patchValue(result.state);
                this.Form.get('amphoe').patchValue(result.city);
                this.Form.get('tambon').patchValue(result.town);
                this.Form.get('zipcode').patchValue(result.zipcode);
                this.Form.get('dealer_addr_lat').patchValue(result.supplier_addr_location_lat);
                this.Form.get('dealer_addr_lng').patchValue(result.supplier_addr_location_lng);
                this.Form.get('latitudeAndLongitude').patchValue(result.supplier_addr_location_lat + ',' + result.supplier_addr_location_lng);
                this.changeProvinceEdit(result.state, result.city, result.town);

            }

        });
    }

    get f() { return this.Form.controls; }
    onSubmit() {
        this.submitted = true;
        if (this.Form.invalid) {
            return;
        }
    }

    btnCancelClick() {
        this.router.navigate([this.UrlRouter_DealersList]);
    }

    btnBackClick() {
        this.router.navigate([this.UrlRouter_DealersDetail, this.RowID]);
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

        if (this.RowID === "new") {
            const dataJsons = {
                "distributor_id": this.id_local,
                "sale_rep_id": 0,
                "dealer_name": this.Form.value.dealersName,
                "dealer_first_name": this.Form.value.firstName,
                "dealer_last_name": this.Form.value.lastName,
                "dealer_tel": this.phones.tel.number,
                "dealer_mobile": this.mobiles.mobile.number,
                "dealer_email": this.Form.value.emailAddress,
                "dealer_tag": this.Form.value.productcategory,
                "dealer_company": this.Form.value.companyName,
                "dealer_addr_full": this.Form.value.addressFull,
                "dealer_addr_number": this.Form.value.addressNo,
                "dealer_addr_tambon": this.Form.value.tambon,
                "dealer_addr_amphoe": this.Form.value.amphoe,
                "dealer_addr_province": this.Form.value.province,
                "dealer_addr_post": this.Form.value.zipcode,
                "dealer_addr_lat": this.Form.value.dealer_addr_lat,
                "dealer_addr_lng": this.Form.value.dealer_addr_lng,
                "dealer_image_url": (this.image.main_image.port.length > 0) ? this.image.main_image.port[0].image_url : "-",

            }

            const dataJson = JSON.stringify(dataJsons)
            console.log(dataJsons);
            this.dealerAPIService.addDealer(dataJson).subscribe(data => {
                this.Form.reset();
                this.router.navigate([this.UrlRouter_DealersList]);
                console.log(data);
            })

        } else {
            const dataJsons = {
                "dealer_id": this.arrobjRow.dealer_id,
                "distributor_id": this.id_local,
                "sale_rep_id": 0,
                "dealer_name": this.Form.value.dealersName,
                "dealer_first_name": this.Form.value.firstName,
                "dealer_last_name": this.Form.value.lastName,
                "dealer_tel": this.phones.tel.number,
                "dealer_mobile": this.mobiles.mobile.number,
                "dealer_email": this.Form.value.emailAddress,
                "dealer_tag": this.Form.value.productcategory,
                "dealer_company": this.Form.value.companyName,
                "dealer_addr_full": this.Form.value.addressFull,
                "dealer_addr_number": this.Form.value.addressNo,
                "dealer_addr_tambon": this.Form.value.tambon,
                "dealer_addr_amphoe": this.Form.value.amphoe,
                "dealer_addr_province": this.Form.value.province,
                "dealer_addr_post": this.Form.value.zipcode,
                "dealer_addr_lat": this.Form.value.dealer_addr_lat,
                "dealer_addr_lng": this.Form.value.dealer_addr_lng,
                "dealer_image_url": (this.image.main_image.port.length > 0) ? this.image.main_image.port[0].image_url : "-",
            }
            const dataJson = JSON.stringify(dataJsons)
            console.log(dataJsons);
            this.dealerAPIService.updateDealer(dataJson).subscribe(data => {
                this.Form.reset();
                this.router.navigate([this.UrlRouter_DealersList]);
                console.log(data);

            })
        }

    }

}
