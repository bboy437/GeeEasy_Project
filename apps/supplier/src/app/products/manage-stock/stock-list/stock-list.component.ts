import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ProductData } from '@project/interfaces';
import { Observable } from 'rxjs';
import { NgbdSortableHeader, SortEvent } from '@project/services';
import { ProductAPIService } from '@project/services';
import { ProductTableService } from './table.service';
import { ColumnMode } from '@swimlane/ngx-datatable';


@Component({
  selector: 'project-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.scss'],
  providers: [ProductTableService, DecimalPipe]
})
export class StockListComponent implements OnInit {

  arrStock: any = [];
  private UrlRouter_StockDetail = "products/stock/detail";
  private UrlRouter_StockCreate = "products/stock/create";
  products$: Observable<ProductData[]>;
  total$: Observable<number>;
  arrProducts: any = [];
  arrClickProducts: any = [];
  isCheckDataProducts = true;
  loading = false;
  isReload = false;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  strname: string;
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
    private router: Router, ) {
    this.loading = true;
  }

  onSort({ column, direction }: SortEvent) {
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
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
    this.service.searchTerm = '';

  }

  showSelect(event: string) {
    this.service.searchTerm = event;
  }


  btnRowClick(row: any): void {
    this.router.navigate([this.UrlRouter_StockDetail, row ]);
  }

  btnRow(e) {
    if (e.type == "click") {
      console.log(e.row);
      this.router.navigate([this.UrlRouter_StockDetail, e.row.supplier_product_id]);
    }
  }


  btnNewClick(): void {
    this.router.navigate([this.UrlRouter_StockCreate, 'new' ]);
  }

  filter(value: any) {
    this.service.searchTerm = value;
  }

}
