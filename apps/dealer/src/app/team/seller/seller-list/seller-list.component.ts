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
import { searchResult, ISeller } from '@project/interfaces';

import { WishlistTableService } from "./table-list.service";
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: "seller-list",
  templateUrl: "./seller-list.component.html",
  styleUrls: ["./seller-list.component.scss"],
  providers: [WishlistTableService, DecimalPipe]
})

export class SellerListComponent implements OnInit {
  private create = "team/seller/create";
  private detail = "team/seller/detail";
  Form: FormGroup;
  wishlist$: Observable<ISeller[]>;
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
    private wishlistTableService: WishlistTableService,
    private formBuilder: FormBuilder,
    ) { 
      this.loadings = true;
  };

  ngOnInit() {

    this.Form = this.formBuilder.group({
      strFilter: [],
    });

    this.getSalerepAccountLists(res => {
      // this.consoleLog("getSalerepAccountLists : ", "res : ", res);
      this.loadings = false;
    });
  };

  filter(value: any) {
    this.wishlistTableService.searchTerm = value;
  }

  refresh() {
    this.Form.get('strFilter').patchValue('');
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
      this.router.navigate([this.detail, item.row.user_id, 'seller']);
    }
  };

  btnNewClick() {
    this.router.navigate([this.create, "new"]);
  }

  onPageChange(event) {
    this.wishlistTableService.pageSize = event;
  }

}
