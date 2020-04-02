import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { Router } from "@angular/router";
import { PipeTransform } from '@angular/core';
import { DecimalPipe } from "@angular/common";
import { ProductData } from "@project/interfaces";
import { ColumnMode } from '@swimlane/ngx-datatable';
import { NgbdSortableHeader, SortEvent } from "@project/services";
import { Component, OnInit, QueryList, ViewChildren } from "@angular/core";


import { SaleRepService ,SellerService} from "@project/services";
import { searchResult, iFSalerepAccount } from '@project/interfaces';

import { WishlistTableService } from "./table-list.service";

@Component({
  selector: "product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
  providers: [WishlistTableService, DecimalPipe]
})

export class SellerListComponent implements OnInit {
  private create = "team/seller/create";
  private detail = "team/seller/detail";

  strFilter: string;

  wishlist$: Observable<iFSalerepAccount[]>;
  tatallist$: Observable<number>;
  ColumnMode = ColumnMode;
  loadings = false;
  isReload = false;
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

  constructor(
    private router:Router,
    private saleRepService: SaleRepService,
    private sellerService: SellerService,
    private wishlistTableService: WishlistTableService) { 
      this.loadings = true;
  };

  ngOnInit() {
    this.getSalerepAccountLists(res => {
      // this.consoleLog("getSalerepAccountLists : ", "res : ", res);
      this.loadings = false;
    });
  };

  filter(value: any) {
    this.wishlistTableService.searchTerm = value;
  }
  refresh() {
    this.strFilter = "";
    this.wishlistTableService.searchTerm = "";
  }

  consoleLog(_function, _title, _data) {
    console.log(_function, _title, _data);
  };

  btnReload() {
    this.isReload = true;
    this.wishlistTableService.getData((res, countries$, total$) => {
      // this.consoleLog("btnReload : ", "res : ", res);
      this.wishlist$ = countries$
      this.tatallist$ = total$
      this.isReload = false;
    });
  }

  getSalerepAccountLists(callback: (res) => any) {
    this.wishlistTableService.getData((res, countries$, total$) => {
      // this.consoleLog("getSalerepAccountLists : ", "res : ", res);
      this.wishlist$ = countries$
      this.tatallist$ = total$
      callback(true);
    });
  };

  btnRow(item) {
    // this.consoleLog("btnRow : ", "item : ", item);
    if (item.type == "click") {
      console.log(item.row);
      this.router.navigate([this.detail, item.row.user_id]);
    }
  };

  btnNewClick() {
    this.router.navigate([this.create, "new"]);
  }
}
