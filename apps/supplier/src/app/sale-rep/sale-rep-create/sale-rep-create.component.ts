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
} from "@angular/forms";
import {
    Component,
    OnInit,
} from "@angular/core";
import { NbDialogService } from "@nebular/theme";
import { DialogsMapComponent } from "../../dialogs/dialogs-map/dialogs-map.component";

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
    arrCategory: any = [];
    product_category_id: string;
    loading = false;
    isReload = false;

    arrProvince: any[] = JSON_PROVINCE;
    arrAmphoe: any[];
    arrTambon: any[];
    arrLocation: any[] = JSON_LOCATION;
    arrLocationDetail: any[] = JSON_LOCATION_DETAIL;


    phones: any;
    mobiles: any;
    isCheckPhone = false;

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

        //Check new or update
        if (this.RowID === "new") {
            this.getCategory();
            this.loading = false;
        } else {
            this.saleRepService.dataSaleRepDetail$.subscribe(res => {
                res ? this.getData(res) : this.router.navigate([this.listPage]);
            })
        }
    }

    getData(data) {
        this.arrobjRow = data.response_data[0];
        if (this.arrobjRow.sale_rep_image_url !== undefined && this.arrobjRow.sale_rep_image_url !== "-" && this.arrobjRow.sale_rep_image_url !== "")
            this.uploadAPIService.uploadImage().getUrl(this.arrobjRow.sale_rep_image_url, red_image => {
                this.image.main_image.get.push(red_image);
            });

        this.editForm();
        /*Get Province Edit */
        this.changeProvinceEdit(
            this.arrobjRow.sale_rep_addr_province,
            this.arrobjRow.sale_rep_addr_amphoe,
            this.arrobjRow.sale_rep_addr_tambon
        );
    }

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
            phone: ["", [Validators.minLength(9)]],
            mobile: ["", [Validators.minLength(10)]],
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
                supplier_id: this.id_local,
                dealer_id: 0,
                sale_rep_id: 0,
                sale_rep_image_url: (this.image.main_image.port.length > 0) ? this.image.main_image.port[0].image_url : "-",
                sale_rep_name: this.Form.value.sale_rep_company,
                sale_rep_company: this.Form.value.sale_rep_name,
                sale_rep_tag: this.Form.value.sale_rep_tag,
                sale_rep_first_name: this.Form.value.sale_rep_first_name,
                sale_rep_last_name: this.Form.value.sale_rep_last_name,
                sale_rep_email: this.Form.value.sale_rep_email,
                sale_rep_mobile: this.mobiles.mobile.number,
                sale_rep_tel: this.phones.tel.number,
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
                supplier_id: this.arrobjRow.supplier_id,
                dealer_id: this.arrobjRow.dealer_id,
                sale_rep_id: this.arrobjRow.sale_rep_id,
                sale_rep_image_url: (this.image.main_image.port.length > 0) ? this.image.main_image.port[0].image_url : "-",
                sale_rep_name: this.Form.value.sale_rep_company,
                sale_rep_company: this.Form.value.sale_rep_name,
                sale_rep_tag: this.Form.value.sale_rep_tag,
                sale_rep_first_name: this.Form.value.sale_rep_first_name,
                sale_rep_last_name: this.Form.value.sale_rep_last_name,
                sale_rep_email: this.Form.value.sale_rep_email,
                sale_rep_mobile: this.mobiles.mobile.number,
                sale_rep_tel: this.phones.tel.number,
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


}
