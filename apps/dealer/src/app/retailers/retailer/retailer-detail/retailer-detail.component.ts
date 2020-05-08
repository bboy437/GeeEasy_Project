
import { DecimalPipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';
import { RetailAccountService, RetailProductService, UploadAPIService } from "@project/services";
import { ColumnMode } from '@swimlane/ngx-datatable';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

import { WishlistTableService } from "./table-list.service";

import { searchRetailersProduct, retailersProduct } from '@project/interfaces';
import { NbDialogService } from '@nebular/theme';
import { DeleteComponent } from '../../../dialogs/delete/delete.component';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: "retailer-detail",
    templateUrl: "./retailer-detail.component.html",
    styleUrls: ["./retailer-detail.component.scss"],
    providers: [WishlistTableService, DecimalPipe]
})

export class RetailerDetailComponent implements OnInit {
    private Url_Retailer_Edit = "retailers/retailer/create";
    strFilter: string;
    events: number[] = []
    arrobjRow: any = [];
    Form: FormGroup;
    wishlist$: Observable<retailersProduct[]>;
    tatallist$: Observable<number>;
    isReload = false;
    loadings = false;
    ColumnMode = ColumnMode;
    messages = {
        emptyMessage: `
        <div class="imglist">
            <img src="assets/images/loadings.png" width="300" >
        </div>
        <div class="labelList">
            <label >No data. Please select information in the list</label>
        </div>
    `
    };


    retailId: string;
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
        private retailAccountService: RetailAccountService,
        private retailProductService: RetailProductService,
        private wishlistTableService: WishlistTableService,
        private dialogService: NbDialogService,
        private uploadAPIService: UploadAPIService,
        private formBuilder: FormBuilder,
    ) {
        this.id_local = localStorage.getItem('id');
        this.loadings = true;
    }

    ngOnInit() {
        this.buildForm();

        const params = this.route.snapshot.paramMap;
        this.retailId = params.get("id");
        if (this.retailId) {
            this.retailAccountService.getRetailAccountDetail(this.retailId).subscribe(res => {
                this.getData(res);
                this.retailAccountService.dataRetailerDetail(res);
            })
        }
    };

    getData(data) {
        data.response_data.forEach(item => {
            console.log('item', item)
            this.arrobjRow = item;

            if (
                item.retail_image_url !== undefined &&
                item.retail_image_url !== "-" &&
                item.retail_image_url !== ""
            )
                this.uploadAPIService
                    .uploadImage()
                    .getUrl(item.retail_image_url, red_image => {
                        this.image.main_image.get.push(red_image);
                    });

            this.getRetailProductLists(red => {
            })
            this.editForm();
        });
    }

    buildForm() {
        this.Form = this.formBuilder.group({
            retail_name: [],
            retail_company: [],
            retail_first_name: [],
            retail_last_name: [],
            retail_email: [],
            retail_tel: [],
            retail_mobile: [],
            Address: [],
            number: [],
            province: [],
            amphoe: [],
            tambon: [],
            zipcode: [],
            location_lat: [],
            location_lng: [],
            location_lat_location_lng: [],
        });
    }

    editForm() {
        this.Form.patchValue({
            retail_name: this.arrobjRow.retail_name,
            retail_company: this.arrobjRow.retail_company,
            retail_first_name: this.arrobjRow.retail_first_name,
            retail_last_name: this.arrobjRow.retail_last_name,
            retail_email: this.arrobjRow.retail_email,
            retail_tel: this.arrobjRow.retail_tel,
            retail_mobile: this.arrobjRow.retail_mobile,
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
        this.Form.disable();
        this.loadings = false;
    }

    click() {
        let self = this;
        const _function = {
            routerNavigateOne(page) {
                self.router.navigate([page]);
            },
            routerNavigateTwo(page, id) {
                self.router.navigate([page, id]);
            },
            routerNavigateThree(page, id, _id) {
                self.router.navigate([page, id, _id]);
            },
            editRetailer() {
                let _self = this;
                const page = "retailers/retailer/create";
                _self.routerNavigateTwo(page, self.retailId);
            },
            listRetailer() {
                let _self = this;
                const page = "retailers/retailer/list";
                _self.routerNavigateOne(page);
            },
            createProducts() {
                let _self = this;
                const page = "retailers/product/create";
                _self.routerNavigateThree(page, self.retailId, "new");
            },
            detailProducts(item) {
                let _self = this;
                if (item.type == "click") {
                    const page = "retailers/product/detail";
                    _self.routerNavigateThree(page, self.retailId, item.row.retail_product_id);
                }
            },
            dealerProduct() {
                let _self = this;
                const page = "retailers/product/dealer";
                _self.routerNavigateThree(page, self.retailId, "push");
            },
        };
        return _function;
    };

    btnEditClick() {
        this.router.navigate([this.Url_Retailer_Edit, this.retailId]);
    }

    btnReload() {
        this.isReload = true;
        this.wishlistTableService.getData((res, countries$, total$) => {
            this.wishlist$ = countries$
            this.tatallist$ = total$
            this.isReload = false;
        });
    }

    getRetailProductLists(callback: (res) => any) {
        this.wishlistTableService.getData((res, countries$, total$) => {
            this.wishlist$ = countries$
            this.tatallist$ = total$
            callback(true);
        });
    };

    filter(value: any) {
        this.wishlistTableService.searchTerm = value;
    }

    remove(retail_product_id, callback: (res) => any) {
        const dataJson = {
            retail_id: this.retailId,
            dealer_id: this.id_local,
            retail_product_id: retail_product_id
        };
        this.retailProductService.postRetailProductRemove(JSON.stringify(dataJson)).subscribe(red => {
            callback(red);
        });
    }

    btnDeleteProduct(i, item) {
        console.log("btnDeleteProduct : item : ", item);

        const dialogRef = this.dialogService.open(DeleteComponent, {
            context: {
                icon: 'archive-outline',
                title: 'Confirm Delete ? ',
            }
        });

        dialogRef.onClose.subscribe(result => {
            if (result === 'ok') {
                this.btnReload();
                this.remove(item.retail_product_id, red => {
                    console.log("btnDeleteProduct : remove :  red : ", red);
                });
            }
        });
    }
}
