import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { Iwarehouse } from '@project/interfaces';
import { Observable } from 'rxjs';
import { NgbdSortableHeader, SortEvent } from '@project/services';
import { ProductAPIService } from '@project/services';
import { ProductTableService } from './table.service';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'project-warehouse-list',
  templateUrl: './warehouse-list.component.html',
  styleUrls: ['./warehouse-list.component.scss'],
  providers: [ProductTableService, DecimalPipe]
})
export class WarehouseListComponent implements OnInit {

  private UrlRouter_StockDetail = "products/warehouse/detail";
  private UrlRouter_StockCreate = "products/warehouse/create";
  Form: FormGroup;
  products$: Observable<Iwarehouse[]>;
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
    public service: ProductTableService,
    private productAPIService: ProductAPIService,
    private router: Router, 
    private formBuilder: FormBuilder,) {

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
    this.Form = this.formBuilder.group({
      strFilter: [],
    });
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
  resetClick() {
    this.isCheckDataProducts = true;
    this.service.searchTerm = '';

  }

  showSelect(event: string) {
    this.service.searchTerm = event;
  }

  btnRefresh(){
    this.service.searchTerm = '';
    this.Form.get('strFilter').patchValue('');
  }

  btnRowClick(row: any): void {
    this.router.navigate([this.UrlRouter_StockDetail, row]);
  }

  btnRow(e) {
    if (e.type == "click") {
      console.log(e.row);
      this.router.navigate([this.UrlRouter_StockDetail, e.row.warehouse_id]);
    }
  }

  btnNewClick(): void {
    this.router.navigate([this.UrlRouter_StockCreate, 'new']);
  }

  filter(value: any) {
    this.service.searchTerm = value;
  }

  onPageChange(event) {
    this.service.pageSize = event;
  }


}
