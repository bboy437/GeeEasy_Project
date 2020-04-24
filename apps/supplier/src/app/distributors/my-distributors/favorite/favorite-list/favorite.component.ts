import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { DistributorAPIService } from '@project/services';
import { WishlistTableService } from './table-list.service';
import { NgbdSortableHeader, SortEvent } from '@project/services';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { IFavoriteList } from '@project/interfaces';
import { ColumnMode } from '@swimlane/ngx-datatable';

@Component({
  selector: 'project-favorite-list',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss'],
  providers: [WishlistTableService, DecimalPipe]
})
export class FavoriteComponent implements OnInit {
  private UrlRouter_FavoriteDetail = "distributors/wishlist/detail";
  wishlist$: Observable<IFavoriteList[]>;
  tatallist$: Observable<number>;
  arrWishlist: any = [];
  isCheckData: string;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  loading = false;
  isReload = false;
  strFilter: string;
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

  constructor(private route: Router,
    private distributorAPIService: DistributorAPIService,
    public service: WishlistTableService,
  ) {
    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);
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
      this.wishlist$ = this.service.countries$;
      this.tatallist$ = this.service.total$;
      this.loading = false;
      callback(true);
    });
  }

  btnReload() {

    this.isReload = true;
    this.service.getData(e => {
      this.wishlist$ = this.service.countries$;
      this.tatallist$ = this.service.total$;
      this.isReload = false;
    });
  }





  btnClickItem(data: any) {
    this.isCheckData = "data";
    this.arrWishlist = data;
    // this.distributorAPIService.clickDataCategory(data);
    this.loading = false;
  }

  filter(value: any) {
    this.service.searchTerm = value;
  }
  refresh() {
    this.strFilter = "";
    this.service.searchTerm = "";
  }

  btnRowClick(row: any) {
    console.log(row);
    this.route.navigate([this.UrlRouter_FavoriteDetail, row]);
  }

  btnRow(e) {
    if (e.type == "click") {
      console.log(e.row);
      this.route.navigate([this.UrlRouter_FavoriteDetail, e.row.distributor_id]);
    }
  }

  btnDialogWishlist(data: any) {
    const dataJsons = {
      "distributor_id": data.distributor_id,
      "supplier_id": this.id_local,
    }
    console.log('dataJsons', dataJsons);
    this.distributorAPIService.addWishList(JSON.stringify(dataJsons)).subscribe(res => {
      // this.getSupplierProducts(this.strproduct);
      // this.getSupplierName(this.strname);
      // this.getCategory()
      this.btnReload();
    })
  }

}
