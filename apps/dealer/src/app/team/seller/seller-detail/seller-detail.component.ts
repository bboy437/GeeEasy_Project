import { Observable } from "rxjs";
import { Router, ActivatedRoute } from '@angular/router';
import { DecimalPipe } from "@angular/common";
import { ProductData } from "@project/interfaces";
import { ColumnMode } from '@swimlane/ngx-datatable';
import { NgbdSortableHeader, SortEvent } from "@project/services";
import { Component, OnInit, QueryList, ViewChildren } from "@angular/core";
import { DialogsImageComponent } from '../../../dialogs/dialogs-image/dialogs-image.component';
import { NbDialogService } from '@nebular/theme';

import { SellerService } from "@project/services";

@Component({
    // tslint:disable-next-line: component-selector
    selector: "seller-detail",
    templateUrl: "./seller-detail.component.html",
    styleUrls: ["./seller-detail.component.scss"],
})
export class SellerDetailComponent implements OnInit {
    private createPage = "team/seller/create";
    private backPage = "team/seller/list";
    private backPageTeam = "team/myteam/list";
    private detailProduct = "team/seller/product-detail";
    products: any = [];
    arrSale: any = [];
    arrSaleProduct: any = [];
    RowID: string;
    status: string;
    loading = false;
    isReload = false;

    totalSale = 0;

    cover_input = {
        col_6_1: [],
        col_6_2: []
    }

    user_ = {
        group_: "-",
        team_: "-",
        user_data_ref: {
            percent_commission: 0,
            total_sale: 0,
        }
    }

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private sellerService: SellerService,
        private dialogService: NbDialogService
    ) {
        this.loading = true;
    }

    ngOnInit() {
        const params = this.route.snapshot.paramMap;
        this.status = params.get("status");
        this.getSalerepAccountDetail(res => {
            console.log("ngOnInit : getSalerepAccountDetail : res : ", res);
            res.response_data.forEach(item => {
                this.arrSale = item;
                this.getDataForm(item, res => {
                    this.cover_input = res;
                });
                // tslint:disable-next-line: forin
                for (const key in item.user_data_ref) {
                    console.log("for in : key : ", key);
                    console.log("for in : item.user_data_ref : ", item.user_data_ref[key]);
                    if (item.user_data_ref.hasOwnProperty(key) && key === 'total_sale') {
                        this.totalSale = item.user_data_ref[key];
                    }
                }
            });
        })
    }

    getCol_6_1(title, callback: (status, res) => any) {
        const col_6_1 = [
            {
                type: "input",
                index: 0,
                title: "user_name",
                topic: "Seller Name",
                input: "", col: "12"
            }, {
                type: "input",
                index: 1,
                title: "user_company",
                topic: "Seller Company",
                input: "", col: "12"
            }, {
                type: "input",
                index: 2,
                title: "user_tag",
                topic: "Seller Tag",
                input: "", col: "12"
            }, {
                type: "input",
                index: 3,
                title: "user_first_name",
                topic: "First Name",
                input: "", col: "12"
            }, {
                type: "input",
                index: 4,
                title: "user_last_name",
                topic: "Last Name",
                input: "", col: "12"
            }, {
                type: "input",
                index: 5,
                title: "user_email",
                topic: "Email",
                input: "", col: "12"
            }, {
                type: "input",
                index: 6,
                title: "user_tel",
                topic: "Telephone Number",
                input: "", col: "12"
            }, {
                type: "input",
                index: 7,
                title: "user_mobile",
                topic: "Mobile Phone Number",
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
                type: "textarea",
                index: 0,
                title: "user_addr_full",
                topic: "Address",
                input: "", col: "12"
            }, {
                type: "input",
                index: 1,
                title: "user_addr_number",
                topic: "Address Number",
                input: "", col: "12"
            }, {
                type: "input",
                index: 2,
                title: "user_addr_province",
                topic: "Address Number",
                input: "", col: "12"
            }, {
                type: "input",
                index: 3,
                title: "user_first_name",
                topic: "Province",
                input: "", col: "12"
            }, {
                type: "input",
                index: 4,
                title: "user_addr_amphoe",
                topic: "Amphoe",
                input: "", col: "12"
            }, {
                type: "input",
                index: 5,
                title: "user_addr_tambon",
                topic: "Tambon",
                input: "", col: "12"
            }, {
                type: "input",
                index: 6,
                title: "user_addr_post",
                topic: "Zipcode",
                input: "", col: "12"
            }
        ],
            status = col_6_2.filter(res => res.title === title).length > 0,
            res = col_6_2.filter(res => res.title === title);
        callback(status, res);
    };

    getDataForm(api, callback: (res) => any) {
        let res = {
            col_6_1: [],
            col_6_2: []
        };
        // tslint:disable-next-line: forin
        for (const key in api) {
            console.log("getDataForm : ", "key : ", key);
            this.getCol_6_1(key, (status, res_) => {
                if (status) {
                    console.log("getDataForm : ", "getCol_6_1 : status : ", status);
                    console.log("getDataForm : ", "getCol_6_1 : res_ : ", res_);
                    res_.forEach(item => {
                        item.input = api[key];
                        res.col_6_1.push(item);
                    });
                }
            });
            this.getCol_6_2(key, (status, res_) => {
                if (status) {
                    console.log("getDataForm : ", "getCol_6_2 : status : ", status);
                    console.log("getDataForm : ", "getCol_6_2 : res_ : ", res_);
                    res_.forEach(item => {
                        item.input = api[key];
                        res.col_6_2.push(item);
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
        callback(res)
        this.loading = false;
    };

    getSalerepAccountDetail(callback: (res) => any) {
        const params = this.route.snapshot.paramMap;
        this.RowID = params.get("id");
        this.sellerService.getSellerDetail(this.RowID).subscribe(res => {
            console.log("getSalerepAccountDetail : res : ", res);
            callback(res);
        })
        this.getProductList();
    };

    getProductList() {
        this.sellerService.getSellerProduct(this.RowID).subscribe(res => {
            this.products = res.response_data;
            if (this.products.length > 0) {
                this.products.forEach(element => {
                    element.product_wholesale_array.forEach(wholesale => {
                        element.product_qty = 1;
                        element.product_price = wholesale.product_price;
                        wholesale.unit_price = wholesale.unit_prices;

                    });
                });
            }
            console.log('products', this.products);
        })
    }

    dataProduct(data) {
        this.arrSaleProduct = data;
    }

    btnEditClick() {
        this.router.navigate([
            this.createPage,
            this.arrSale.user_id
        ]);
    }

    btnCancelClick() {
        if (this.status === 'seller') {
            this.router.navigate([this.backPage]);
        } else {
            this.router.navigate([this.backPageTeam]);
        }
    }

    btnRowProduct(row) {
        console.log('row', row);
        this.router.navigate([this.detailProduct, this.RowID, row]);

    }

    openImg(img: any) {
        this.dialogService.open(DialogsImageComponent, {
            context: {
                imgURL: img,
            },
        });
    }
}
