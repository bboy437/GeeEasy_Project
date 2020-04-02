import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { IStock } from '@project/interfaces';
import { Observable } from 'rxjs';
import { NgbdSortableHeader, SortEvent } from '@project/services';
import { ProductAPIService } from '@project/services';
import { StockTableService } from './table.service';


@Component({
  selector: 'project-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.scss'],
  providers: [StockTableService, DecimalPipe]
})
export class StockListComponent implements OnInit {

  arrStock: any = [];
  private UrlRouter_StockCreate = "products/stock/create";
  stock$: Observable<IStock[]>;
  total$: Observable<number>;
  arrProducts: any = [];
  arrClickProducts: any = [];
  isCheckDataProducts = true;
  strFilter: string;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  private UrlRouter_ProductDetail = "products/detail";
  private UrlRouter_ProductTransfer = "products/stock/transfer";
  private UrlRouter_ProductDistributorDetail = "products/manage/detail-product-distributor";
  loading = false;
  isReload = false;


  constructor(
    public service: StockTableService,
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
      this.stock$ = this.service.countries$;
      this.total$ = this.service.total$;
      this.loading = false;
      callback(true);
    });
  }

  btnReload() {
    this.isReload = true;
    this.service.getData(e => {
      this.stock$ = this.service.countries$;
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

  btnRowClick(row: any): void {

    console.log("btnRowClick : row : ", row);
    if (row.supplier_id !== 0) {
      this.router.navigate([this.UrlRouter_ProductDetail, row.product_id], { queryParams: { status: "stock" } });
    } else {
      this.router.navigate([this.UrlRouter_ProductDistributorDetail, row.product_id, 'stock']);
    }
  }


  btnNewClick(): void {
    this.router.navigate([this.UrlRouter_StockCreate, 'new']);
  }

  filter(value: any) {
    this.service.searchTerm = value;
  }

  btnRefresh() {
    this.service.searchTerm = '';
    this.strFilter = '';
  }

  btnFilter() {
    this.service.searchTerm = this.strFilter;
  }

  btnUpdateStock(data: any, warehouse_id) {

    const param_product_json = [];
    param_product_json.push({
      warehouse_id: warehouse_id,
      checkin_data: data.checkin_data,
      distributor_product_id: data.distributor_product_id,
      distributor_product_create_time: data.distributor_product_create_time

    });
    console.log(param_product_json);
    this.updateStock(param_product_json)


  }

  updateStock(param_product_json) {

    const dataJson = {
      "product_json": param_product_json
    }

    console.log(JSON.stringify(dataJson)
    );
    this.productAPIService.updateStockDist(JSON.stringify(dataJson)).subscribe(data => {
      console.log(data);
      this.service.searchTerm = "";
    })

  }

  btnTransfer(product: any, id) {
    console.log("id : id : ", id);
    console.log("btnTransfer : product : ", product);
    this.productAPIService.clickDataTransfer(product);
    this.tranfer(product, id)

  }
  tranfer(product: any, id) {
    if (product.supplier_id !== 0) {
      this.router.navigate([this.UrlRouter_ProductTransfer, { data: JSON.stringify(product.distributor_product_id) }]);
    } else {
      this.router.navigate([this.UrlRouter_ProductTransfer, { distributor_product_id: JSON.stringify(product.distributor_product_id) }]);
    }
  }


}
