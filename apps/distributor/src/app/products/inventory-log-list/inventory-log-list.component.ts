import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ProductData } from '@project/interfaces';
import { Observable } from 'rxjs';
import { NgbdSortableHeader, SortEvent } from '@project/services';
import { ProductAPIService } from '@project/services';
import { InventoryLogTableService } from './table.service';
import { ColumnMode } from '@swimlane/ngx-datatable';


@Component({
  selector: 'project-inventory-log-list',
  templateUrl: './inventory-log-list.component.html',
  styleUrls: ['./inventory-log-list.component.scss'],
  providers: [InventoryLogTableService, DecimalPipe]
})
export class InventoryLogListComponent implements OnInit {

  private UrlRouter_ProductDetail = "products/detail";
  products$: Observable<ProductData[]>;
  total$: Observable<number>;
  arrProducts: any = [];
  arrClickProducts: any = [];
  isCheckDataProducts = true;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
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
  
  constructor(
    public service: InventoryLogTableService,
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
    // this.getProductGroup();
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


  btnRowClick(row: any): void {
    this.router.navigate([this.UrlRouter_ProductDetail, row], { queryParams: { status: "list" } });
  }

  btnRow(e) {
    // if (e.type == "click") {
    //   console.log(e.row);
    //   this.router.navigate([this.UrlRouter_ProductDetail, e.row.supplier_id]);
    // }
  }

  resetClick() {
    this.isCheckDataProducts = true;
    this.service.searchTerm = '';

  }

  showSelect(event: string) {
    this.service.searchTerm = event;
  }

  filter(value: any) {
    this.service.searchTerm = value;
  }

  btnRefresh() {
    this.service.searchTerm = '';
  }


}