import { Observable } from "rxjs";
import { Router, ActivatedRoute } from '@angular/router';
import { DecimalPipe } from "@angular/common";
import { ProductData } from "@project/interfaces";
import { ColumnMode } from '@swimlane/ngx-datatable';
import { NgbdSortableHeader, SortEvent, UploadAPIService } from "@project/services";
import { Component, OnInit, QueryList, ViewChildren } from "@angular/core";
import { DialogsImageComponent } from '../../../dialogs/dialogs-image/dialogs-image.component';
import { NbDialogService } from '@nebular/theme';

import { SellerService } from "@project/services";
import { FormBuilder, FormGroup } from '@angular/forms';

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
    arrobjRow: any = [];
    Form: FormGroup;
    RowID: string;
    status: string;
    loading = false;
    isReload = false;

    totalSale = 0;

    user_ = {
        group_: "-",
        team_: "-",
        user_data_ref: {
            percent_commission: 0,
            total_sale: 0,
        }
    }

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
        private sellerService: SellerService,
        private dialogService: NbDialogService,
        private uploadAPIService: UploadAPIService,
        private formBuilder: FormBuilder,
    ) {
        this.loading = true;
    }

    ngOnInit() {

        this.Builder();
        const params = this.route.snapshot.paramMap;
        this.status = params.get("status");
        this.RowID = params.get("id");

        if (this.RowID) {

            this.sellerService.getSellerDetail(this.RowID).subscribe(res => {
                this.sellerService.dataSellerDetail(res);;
                this.getData(res);
            })
        }
    }

    getData(data) {
        console.log(data);
        this.arrobjRow = data.response_data[0];
        if (this.arrobjRow.user_image_url !== undefined && this.arrobjRow.user_image_url !== "-" && this.arrobjRow.user_image_url !== "")
            this.uploadAPIService.uploadImage().getUrl(this.arrobjRow.user_image_url, red_image => {
                this.image.main_image.get.push(red_image);
            });


        /*Value Data Form */
        this.editForm();
        this.getProductList();
    }

    Builder() {
        this.Form = this.formBuilder.group({
            user_name: [],
            user_company: [],
            user_tag: [],
            user_first_name: [],
            user_last_name: [],
            user_email: [],
            user_tel: [],
            user_mobile: [],
            addressFull: [],
            addressNo: [],
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
            user_name: this.arrobjRow.user_name,
            user_company: this.arrobjRow.user_company,
            user_tag: this.arrobjRow.user_tag,
            user_first_name: this.arrobjRow.user_first_name,
            user_last_name: this.arrobjRow.user_last_name,
            user_email: this.arrobjRow.user_email,
            user_tel: this.arrobjRow.user_tel,
            user_mobile: this.arrobjRow.user_mobile,
            addressFull: this.arrobjRow.user_addr_full,
            addressNo: this.arrobjRow.user_addr_number,
            province: this.arrobjRow.user_addr_province,
            amphoe: this.arrobjRow.user_addr_amphoe,
            tambon: this.arrobjRow.user_addr_tambon,
            zipcode: this.arrobjRow.user_addr_tambon,
            location_lat: this.arrobjRow.user_addr_lat,
            location_lng: this.arrobjRow.user_addr_lng,
            location_lat_location_lng: this.arrobjRow.user_addr_lat + ',' + this.arrobjRow.user_addr_lng,
        });
        this.Form.disable();
        console.log(this.Form);
        this.loading = false;
    }

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

    btnEditClick() {
        this.router.navigate([
            this.createPage,
            this.arrobjRow.user_id
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
