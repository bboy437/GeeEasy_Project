import { Component, OnInit, QueryList, ViewChildren } from "@angular/core";
import { Router } from "@angular/router";
import { DecimalPipe } from "@angular/common";
import { ProductDataArray } from "@project/interfaces";
import { Observable } from "rxjs";
import { NgbdSortableHeader, SortEvent } from "@project/services";
import { ProductAPIService } from "@project/services";
import { ProductTableService } from "./products-table.service";
import { ColumnMode } from '@swimlane/ngx-datatable';

@Component({
    selector: "project-products-list",
    templateUrl: "./products-list.component.html",
    styleUrls: ["./products-list.component.scss"],
    providers: [ProductTableService, DecimalPipe]
})
export class ProductsListComponent implements OnInit {
    private UrlRouter_ProductDetail = "products/manage/detail";
    private UrlRouter_ProductCreate = "products/manage/create";
    products$: Observable<ProductDataArray[]>;
    total$: Observable<number>;
    arrProducts: any = [];
    arrClickProducts: any = [];
    isCheckDataProducts = true;
    loading = false;
    isReload = false;
    strname: string;
    @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
    ColumnMode = ColumnMode;
    messages = {
        emptyMessage: `
        <div class="imglist">
            <img src="assets/images/loading.png" width="300"  >
        </div>
        <div class="labelList">
            <label >No data. Please select information in
                the list</label>
        </div>
    `
    }


    constructor(
        public service: ProductTableService,
        private productAPIService: ProductAPIService,
        private router: Router
    ) {
        this.loading = true;
    }

    onSort({ column, direction }: SortEvent) {
        this.headers.forEach(header => {
            if (header.sortable !== column) {
                header.direction = "";
            }
        });
        this.service.sortColumn = column;
        this.service.sortDirection = direction;
    }

    ngOnInit() {
        this.callApi(e => {
            // completed
        });
    }

    callApi(callback) {
        this.service.getData(e => {
            this.products$ = this.service.countries$;
            this.total$ = this.service.total$;
            this.loading = false;
            callback(true);
        });
    }

    btnReload() {

        this.isReload = true;
        this.service.getData(e => {
            this.products$ = this.service.countries$;
            this.total$ = this.service.total$;
            this.isReload = false;
        });
    }

    btnRefresh() {
        this.service.searchTerm = "";
        this.strname = ""
    }

    resetClick() {
        this.isCheckDataProducts = true;
        this.service.searchTerm = "";
    }

    showSelect(event: string) {
        this.service.searchTerm = event;
    }

    btnRowClick(row: any): void {
        this.router.navigate([this.UrlRouter_ProductDetail, row]);
    }

    btnRow(e) {
        if (e.type == "click") {
            console.log(e.row);
            this.router.navigate([this.UrlRouter_ProductDetail, e.row.supplier_product_id]);
        }
    }


    btnNewClick(): void {
        this.router.navigate([this.UrlRouter_ProductCreate, "new"]);
    }

    filter(value: any) {
        this.service.searchTerm = value;
    }
}
