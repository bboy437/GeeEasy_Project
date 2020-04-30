import {
    Component,
    OnInit,
    Input,
    QueryList,
    ViewChildren
} from "@angular/core";
import { Router } from "@angular/router";
import { MyDistributorTableService } from "./table-list.service";
import { NgbdSortableHeader, SortEvent } from "@project/services";
import { Observable } from "rxjs";
import { DecimalPipe } from "@angular/common";
import { IDistributor } from "@project/interfaces";
import { NbDialogService } from "@nebular/theme";
import { DialogsSavedListComponent } from "../../../../dialogs/dialogs-saved-list/dialogs-saved-list.component";
import { DistributorAPIService } from "@project/services";
import { ColumnMode } from '@swimlane/ngx-datatable';

@Component({
    selector: "project-my-distributors-list",
    templateUrl: "./my-distributors-list.component.html",
    styleUrls: ["./my-distributors-list.component.scss"],
    providers: [MyDistributorTableService, DecimalPipe]
})
export class MyDistributorsListComponent implements OnInit {
    @Input() strStatus: string;
    private UrlRouter_DistributorSave = "distributors/create";
    private UrlRouter_DistributorDetail = "distributors/detail";
    arrDistributor: any = [];
    arrDistributorDetail: any = [];
    isCheckData: string;
    myDistributorList$: Observable<IDistributor[]>;
    totalList$: Observable<number>;
    date = new Date();
    @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
    strname: string;
    id: string;
    loading = false;
    isReload = false;
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

    id_local: string;

    constructor(
        private distributorAPIService: DistributorAPIService,
        private router: Router,
        public service: MyDistributorTableService,
        private dialogService: NbDialogService
    ) {
        this.id_local = localStorage.getItem('id');
        console.log(' this.id_local', this.id_local);
        this.loading = true;
    }

    onSort({ column, direction }: SortEvent) {
        console.log({ column, direction });

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
            this.distributorAPIService.selectCategory$.subscribe(res => {
                if (res) {
                    this.id = res[0].distributor_id;
                    this.isCheckData = "data";
                    this.arrDistributorDetail = res;
                }
            })
        });
    }

    callApi(callback) {
        this.service.getData(e => {
            this.myDistributorList$ = this.service.countries$;
            this.totalList$ = this.service.total$;
            this.loading = false;
            callback(true);
        });
    }

    btnReload() {

        this.isReload = true;
        this.service.getData(e => {
            this.myDistributorList$ = this.service.countries$;
            this.totalList$ = this.service.total$;
            this.isReload = false;
        });
    }

    btnRefresh() {
        this.service.searchTerm = "";
        this.strname = ""
    }

    btnClickItem(data: any, ) {
        console.log("btnClickItem : data : ", data);
        this.arrDistributorDetail = [];
        this.loading = true;
        this.id = data.distributor_id;
        this.isCheckData = "data";
        this.arrDistributorDetail.push(data)
        console.log(this.arrDistributorDetail);
        this.distributorAPIService.dataSelectCategory(this.arrDistributorDetail);
        this.loading = false;
    }

    btnRowClick(row: any) {
        const id = row;
        this.router.navigate([this.UrlRouter_DistributorDetail, id]);
    }

    btnRow(e) {
        if (e.type == "click") {
            console.log(e.row);
            this.router.navigate([this.UrlRouter_DistributorDetail, e.row.distributor_id]);
        }
    }

    filter(value: any) {
        this.service.searchTerm = value;
    }

    filters() {
        this.service.searchTerm = this.strname;
    }

    reset() {
        this.strname = "";
        this.service.searchTerm = "";
    }

    btnNewClick() {
        this.router.navigate([this.UrlRouter_DistributorSave, "new"]);
    }

    btnDialogSavelists(data) {
        const dialogRef = this.dialogService.open(DialogsSavedListComponent, {
            context: {
                data: data,
                isData: 'new'
            }
        });
        dialogRef.onClose.subscribe(result => {
            console.log(result);
            if (result) {
            }
        });
    }

    btnDialogWishlist(data: any) {
        if (data.distributor_is_wish === 1) {
            data.distributor_is_wish = 0;
        } else {
            data.distributor_is_wish = 1;
        }
        const dataJsons = {
            "distributor_id": data.distributor_id,
            "supplier_id": this.id_local,
        }
        console.log('dataJsons', dataJsons);
        this.distributorAPIService.addWishList(JSON.stringify(dataJsons)).subscribe(res => {

        })

    }

}
