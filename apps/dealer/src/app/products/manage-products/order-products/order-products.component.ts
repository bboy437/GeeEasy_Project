import { Component, OnInit, QueryList, ViewChildren, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ProductData } from '@project/interfaces';
import { Observable } from 'rxjs';
import { NgbdSortableHeader, SortEvent } from '@project/services';
import { ProductAPIService } from '@project/services';

import { ColumnMode } from '@swimlane/ngx-datatable';
import { TableService } from './table.service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'project-order-products',
  templateUrl: './order-products.component.html',
  styleUrls: ['./order-products.component.scss'],
  providers: [TableService, DecimalPipe]
})
export class OrderProductsComponent implements OnInit {
  private UrlRouter_ProductDetail = "products/detail";
  private UrlRouter_ProductDistributorDetail = "products/detail-product-distributor";
  private productDetail = "products/products/detail";

  products$: Observable<ProductData[]>;
  total$: Observable<number>;
  arrProducts: any = [];
  arrClickProducts: any = [];
  isCheckDataProducts = true;
  Form: FormGroup;
  loading = false;
  isReload = false;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  @ViewChild('myTable', { static: false }) table: any;
  ColumnMode = ColumnMode;
  isTab: string;

  constructor(
    public service: TableService,
    private productAPIService: ProductAPIService,
    private router: Router,
    private formBuilder: FormBuilder, ) {
    this.loading = true;
  }


  ngOnInit() {
    this.Form = this.formBuilder.group({
      strFilter: [],
    });

    this.callApi(e => {
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
    console.log("btnRowClick : row : ", row);
    if (row.distributor_id !== 0) {
      this.router.navigate([this.UrlRouter_ProductDetail, row.dealer_id, row.product_id, row.product_sku], { queryParams: { status: "Order Products" } });
    } else {
      this.router.navigate([this.productDetail, row.product_id]);
    }
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
    this.Form.get('strFilter').patchValue('');
  }

  onPageChange(event) {
    this.service.pageSize = event;
  }

}