import { Component, OnInit, ViewChildren, QueryList, Output, EventEmitter, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { IFavoriteList } from '@project/interfaces';
import { NgbdSortableHeader, SortEvent, ProductAPIService } from '@project/services';
import { FarvoriteTableService } from './farvorite-table.service';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'project-farvorite',
  templateUrl: './farvorite.component.html',
  styleUrls: ['./farvorite.component.scss'],
  providers: [FarvoriteTableService, DecimalPipe]
})
export class FarvoriteComponent implements OnInit {

  // @Output() favorite = new EventEmitter<any>();
  // @Input() strTab: string
  private UrlRouter_ProductDetail = "products/manage/detail";
  arrFarvorite$: Observable<IFavoriteList[]>;
  total$: Observable<number>;
  arrFarvorite: any = [];
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  loading = false;
  isReload = false;

  id_local: string;

  constructor(
    public service: FarvoriteTableService,
    private productAPIService: ProductAPIService,
    private router: Router, ) {
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
    // this.service.sortColumn = column;
    // this.service.sortDirection = direction;
  }

  ngOnInit() {
    // this.getProductGroup();

    this.callApi(e => {
      // completed
    });
  }

  callApi(callback) {
    this.service.getData(e => {
      this.arrFarvorite$ = this.service.countries$;
      this.total$ = this.service.total$;
      this.loading = false;
      callback(true);
    });
  }

  unFarvorite(product_id) {
    const values = {
      "distributor_id": this.id_local,
      "product_id": product_id
    }
    console.log(values);

    this.productAPIService.addFarvorite(JSON.stringify(values)).subscribe(data => {
      console.log(data);
      this.btnReload();
    })
  }

  btnReload() {

    this.isReload = true;
    this.service.getData(e => {
      this.arrFarvorite$ = this.service.countries$;
      this.total$ = this.service.total$;
      this.isReload = false;
    });
  }

  btnRefresh() {
    this.service.searchTerm = "";
  }

}
