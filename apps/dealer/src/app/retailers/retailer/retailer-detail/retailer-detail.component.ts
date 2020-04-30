
import { DecimalPipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';
import { RetailAccountService, RetailProductService } from "@project/services";
import { ColumnMode } from '@swimlane/ngx-datatable';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

import { WishlistTableService } from "./table-list.service";

import { searchRetailersProduct, retailersProduct } from '@project/interfaces';
import { NbDialogService } from '@nebular/theme';
import { DeleteComponent } from '../../../dialogs/delete/delete.component';

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
    wishlist$: Observable<retailersProduct[]>;
    tatallist$: Observable<number>;
    isReload = false;
    loadings = false;
    ColumnMode = ColumnMode;
    messages = {
        emptyMessage: `
        <div class="imglist">
            <img src="assets/images/loading.png" width="300" >
        </div>
        <div class="labelList">
            <label >No data. Please select information in the list</label>
        </div>
    `
    };


    dataSend = {
        retailer_id: "0",
        data_api: {
            retail_name: '-',
            retail_image_url: '-'
        },
        map: {
            latitude: 0,
            longitude: 0
        },
        loading: false
    };

    cover_input = {
        col_6_1: [],
        col_6_2: [],
        col_6_3: []
    }

    retailId: string;

    id_local: string;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private retailAccountService: RetailAccountService,
        private retailProductService: RetailProductService,
        private wishlistTableService: WishlistTableService,
        private dialogService: NbDialogService,
    ) {
        this.id_local = localStorage.getItem('id');
        console.log(' this.id_local', this.id_local);
        this.loadings = true;
    }

    ngOnInit() {
        this.dataSend.loading = true;
        const params = this.route.snapshot.paramMap;
        this.dataSend.retailer_id = params.get("id");
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
            this.dataSend.data_api = item;
            this.dataSend.map.latitude = (item.retail_addr_lat !== undefined) ? item.retail_addr_lat : 0;
            this.dataSend.map.longitude = (item.retail_addr_lng !== undefined) ? item.retail_addr_lng : 0;
            setTimeout(() => this.dataSend.loading = false, 1000);
            console.log("getSalerepAccountDetail : item : ", item);
            this.getDataForm(item, res => {
                this.cover_input = res;
            });
            this.getRetailProductLists(red => {
                this.loadings = false;
            })
        });
    }


    getDataForm(api, callback: (res) => any) {
        let res = {
            col_6_1: [],
            col_6_2: [],
            col_6_3: []
        };
        // tslint:disable-next-line: forin
        for (const key in api) {
            this.getCol_6_1(key, (status, res_) => {
                if (status) {
                    res_.forEach(item => {
                        item.input = api[key];
                        res.col_6_1.push(item);
                    });
                }
            });
            this.getCol_6_2(key, (status, res_) => {
                if (status) {
                    res_.forEach(item => {
                        item.input = api[key];
                        res.col_6_2.push(item);
                    });
                }
            });
            this.getCol_6_3(key, (status, res_) => {
                if (status) {
                    res_.forEach(item => {
                        item.input = api[key];
                        res.col_6_3.push(item);
                    });
                }
            });
        }
        res.col_6_1.sort(function (a, b) {
            return a.index - b.index;
        });
        res.col_6_2.sort(function (a, b) {
            return a.index - b.index;
        });
        res.col_6_3.sort(function (a, b) {
            return a.index - b.index;
        });
        callback(res)
    };

    getCol_6_1(title, callback: (status, res) => any) {
        const col_6_1 = [
            {
                type: "input",
                index: 0,
                title: "retail_name",
                topic: "Retail Name",
                input: "", col: "12"
            }, {
                type: "input",
                index: 1,
                title: "retail_company",
                topic: "Retail Company",
                input: "", col: "12"
            }
        ],
            status = col_6_1.filter(res => res.title === title).length > 0,
            res = col_6_1.filter(res => res.title === title);
        callback(status, res);
    };

    getCol_6_2(title, callback: (status, res) => any) {
        const col_6_2 = [
            {
                type: "input",
                index: 0,
                title: "retail_first_name",
                topic: "First Name",
                input: "", col: "12"
            }, {
                type: "input",
                index: 1,
                title: "retail_last_name",
                topic: "Last Name",
                input: "", col: "12"
            }, {
                type: "input",
                index: 2,
                title: "retail_email",
                topic: "Email",
                input: "", col: "12"
            }, {
                type: "input",
                index: 3,
                title: "retail_tel",
                topic: "Telephone Number",
                input: "", col: "12"
            }, {
                type: "input",
                index: 4,
                title: "retail_mobile",
                topic: "Mobile Phone Number",
                input: "", col: "12"
            }
        ],
            status = col_6_2.filter(res => res.title === title).length > 0,
            res = col_6_2.filter(res => res.title === title);
        callback(status, res);
    };

    getCol_6_3(title, callback: (status, res) => any) {
        const col_6_3 = [
            {
                type: "textarea",
                index: 0,
                title: "retail_addr_full",
                topic: "Address",
                input: "", col: "12"
            }, {
                type: "input",
                index: 1,
                title: "retail_addr_number",
                topic: "Address Number",
                input: "", col: "12"
            }, {
                type: "input",
                index: 2,
                title: "retail_addr_province",
                topic: "Province",
                input: "", col: "12"
            }, {
                type: "input",
                index: 3,
                title: "retail_addr_amphoe",
                topic: "Amphoe",
                input: "", col: "12"
            }, {
                type: "input",
                index: 4,
                title: "retail_addr_tambon",
                topic: "Tambon",
                input: "", col: "12"
            }, {
                type: "input",
                index: 5,
                title: "retail_addr_post",
                topic: "Zipcode",
                input: "", col: "6"
            }
        ],
            status = col_6_3.filter(res => res.title === title).length > 0,
            res = col_6_3.filter(res => res.title === title);
        callback(status, res);
    };

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
                _self.routerNavigateTwo(page, self.dataSend.retailer_id);
            },
            listRetailer() {
                let _self = this;
                const page = "retailers/retailer/list";
                _self.routerNavigateOne(page);
            },
            createProducts() {
                let _self = this;
                const page = "retailers/product/create";
                _self.routerNavigateThree(page, self.dataSend.retailer_id, "new");
            },
            detailProducts(item) {
                let _self = this;
                if (item.type == "click") {
                    const page = "retailers/product/detail";
                    _self.routerNavigateThree(page, self.dataSend.retailer_id, item.row.retail_product_id);
                }
            },
            dealerProduct() {
                let _self = this;
                const page = "retailers/product/dealer";
                _self.routerNavigateThree(page, self.dataSend.retailer_id, "push");
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
