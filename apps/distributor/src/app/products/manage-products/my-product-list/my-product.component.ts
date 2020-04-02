import { Component, OnInit, QueryList, ViewChildren, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ProductData } from '@project/interfaces';
import { Observable } from 'rxjs';
import { NgbdSortableHeader, SortEvent } from '@project/services';
import { ProductAPIService } from '@project/services';
import { ProductTableService } from './my-product-table.service';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { DialogsProductGroupComponent } from '../../../dialogs/dialogs-product-group/dialogs-product-group.component';
import { NbDialogService } from '@nebular/theme';

@Component({
  selector: 'project-my-product',
  templateUrl: './my-product.component.html',
  styleUrls: ['./my-product.component.scss'],
  providers: [ProductTableService, DecimalPipe]
})
export class MyProductComponent implements OnInit {
  private UrlRouter_ProductCreate = "products/manage/create";
  private UrlRouter_ProductDetail = "products/detail";
  private UrlRouter_ProductDistributorDetail = "products/manage/detail-product-distributor";
  products$: Observable<ProductData[]>;
  total$: Observable<number>;
  arrProducts: any = [];
  arrClickProducts: any = [];
  isCheckDataProducts = true;
  strFilter: string;
  loading = false;
  isReload = false;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  // @ViewChild('myTable') table: any;
  ColumnMode = ColumnMode;
  isTab: string;

  id_local: string;


  constructor(
    public service: ProductTableService,
    private productAPIService: ProductAPIService,
    private router: Router,
    private dialogService: NbDialogService,
  ) {
    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);
    // this.loading = true;
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
    // this.callApi(e => {
    // });
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
    if (row.product_row_key.supplier_id !== 0) {
      this.router.navigate([this.UrlRouter_ProductDetail, row.product_id], { queryParams: { status: "list" } });
    } else {
      this.router.navigate([this.UrlRouter_ProductDistributorDetail, row.product_id , 'product']);
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
    this.strFilter = '';
  }

  btnFilter() {
    this.service.searchTerm = this.strFilter;
  }

  addFarvorite(product_id, data) {

    if (data.product_is_favorite === 1) {
      data.product_is_favorite = 0;
    } else {
      data.product_is_favorite = 1;
    }

    const values = {
      "distributor_id": this.id_local,
      "product_id": product_id
    }
    console.log(values);

    this.productAPIService.addFarvorite(JSON.stringify(values)).subscribe(res => {
      console.log(res);
    })
  }

  btnDialogProductGroup(products) {
    console.log('products', products);

    const dialogRef = this.dialogService.open(DialogsProductGroupComponent, {
      context: {
        status: 'addProductTogroup',
        product_id: products.product_id
      }
    });

    dialogRef.onClose.subscribe(result => {
      if (result) {
      }
    });

  }


  btnNewClick(): void {
    this.router.navigate([this.UrlRouter_ProductCreate, "new"]);
  }

  // onFavorite(e) {
  //   this.onTab(e);
  // }

  onTab(e) {
    console.log('e', e);

    // if (e === "My Products") {
    this.btnReload();
    // } else {
    this.isTab = e;
    // }
  }

}
