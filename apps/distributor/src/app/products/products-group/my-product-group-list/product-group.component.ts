import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ProductAPIService } from '@project/services';
import { Router } from '@angular/router';
import { ProductGroupTableService } from './table-list.service';
import { DecimalPipe } from '@angular/common';
import { NgbdSortableHeader } from '@project/services';
import { Observable } from 'rxjs';
import { IProductGroup } from '@project/interfaces';
import { NbDialogService } from '@nebular/theme';
import { DialogsProductGroupComponent } from '../../../dialogs/dialogs-product-group/dialogs-product-group.component';
import { ColumnMode } from '@swimlane/ngx-datatable';

@Component({
  selector: 'project-my-product-group',
  templateUrl: './product-group.component.html',
  styleUrls: ['./product-group.component.scss'],
  providers: [ProductGroupTableService, DecimalPipe]
})
export class MyProductGroupComponent implements OnInit {
  private UrlRouter_ProductDetail = "products/detail";
  arrProductGroup: any = [];
  arrProductGroupDetail: any = [];
  strProductlist: string;
  strProductdetail: string;
  isCheckDataList = "true";
  isCheckDataDetail = "true";
  products$: Observable<IProductGroup[]>;
  total$: Observable<number>;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  loading = false;
  isReload = false;
  id: string
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
    public service: ProductGroupTableService,
    private productAPIService: ProductAPIService,
    private router: Router,
    private dialogService: NbDialogService,
  ) {
    this.loading = true;
  }


  ngOnInit() {
    // this.getProductGroup();
    this.callApi(e => {
      this.productAPIService.productGroupSelectedAction$.subscribe(res => {
        console.log(res);
        if (res) {
          this.arrProductGroup = res
          this.arrProductGroupDetail = res.inventory_group_array;
        }
      })
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



  btnClickItem(data: any) {
    this.isReload = true;
    // console.log(data);
    this.productAPIService.selectedProductGroup(data);
    this.arrProductGroup = data
    this.arrProductGroupDetail = data.inventory_group_array;
    console.log(this.arrProductGroupDetail);
    this.isReload = false;
  }

  btnDialogSaveProductGroup() {
    const dialogRef = this.dialogService.open(DialogsProductGroupComponent, {
      context: {
        status: 'create'
      }
    });

    dialogRef.onClose.subscribe(result => {
      if (result) {
        this.btnReload();
      }

    });

  }

  filterList(value: any) {
    this.service.searchTerm = value;
  }

  btnRefresh() {
    this.service.searchTerm = "";
  }

  btnRowClick(row: any): void {
    this.router.navigate([this.UrlRouter_ProductDetail, row], { queryParams: { status: "group" } });
  }

  btnRow(e) {
    if (e.type == "click") {
      console.log(e.row);
      this.router.navigate([this.UrlRouter_ProductDetail, e.row.product_id], { queryParams: { status: "group" } });
    }
  }


}
