
import { Router, ActivatedRoute } from "@angular/router";
import { Component, OnInit, Input } from "@angular/core";
import {
  DistributorAPIService,
  BrowseSupplierAPIService,
  SaveListSupplierAPIService
} from "@project/services";

import { NbDialogService } from "@nebular/theme";
import { ColumnMode } from '@swimlane/ngx-datatable';

@Component({
  selector: 'project-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  @Input() name: string;
  filter: any = [];
  arrListCategorys: any = [];
  arrCategory: any = [];
  isButton: string;
  isSearchbyCategory = "false";
  strStatus: string;
  strCategory: string;
  strCategoryName: string;
  private UrlRouter_Browse_Detail = "distributors/browse-distributor/detail";
  loading = false;
  loading1 = false;
  strsupCate = '';
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

  constructor(
    private distributorAPIService: DistributorAPIService,
    private router: Router,
    private route: ActivatedRoute,
    private browseSupplierAPIService: BrowseSupplierAPIService,
    private dialogService: NbDialogService,
    private saveListSupplierAPIService: SaveListSupplierAPIService
  ) {
    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);
  }

  ngOnInit() {
    this.strCategory = this.name;
    // this.loading = true;
    // this.loading1 = true;
    // this.getCategory();
  }

  categoryEvent(data) {
    console.log('data', data);
    console.log('product_category__id', data.product_category__id);
    this.loading1 = true;
    if (data.product_category__id !== 0) {
      const value = data.product_category__id + "?supplier_id=" + this.id_local;
      this.distributorAPIService.getDistCate(value).subscribe(res => {
        console.log(res);
        this.arrListCategorys = res.response_data;
        this.loading1 = false;
      })

    } else {
      this.arrListCategorys = [];
      this.loading1 = false;
    }

  }

  getCategory() {
    this.strsupCate = '';
    const valueCategory = 'cur_page=' + 1 + '&per_page=' + 10
    this.browseSupplierAPIService.getCategoryDist(valueCategory).subscribe(data => {
      this.arrCategory = data.response_data;
      this.filter = data.response_data;
      console.log(this.arrCategory);
      this.loading = false;
      this.loading1 = false;
    })
  }

  subCate(product_category_child_array, product_category_id, product_category_name) {
    this.loading1 = true;
    this.strsupCate = product_category_name;
    const supplier_id = "?supplier_id=" + this.id_local;
    this.distributorAPIService.getDistCate(product_category_id + supplier_id).subscribe(res => {
      console.log(res);
      this.arrListCategorys = res.response_data;
      this.loading1 = false;
    })

    if (product_category_child_array.length > 0) {
      const valueCategory = 'cur_page=' + 1 + '&per_page=' + 10 + '&product_category_id=' + product_category_id
      this.browseSupplierAPIService.getCategoryDist(valueCategory).subscribe(data => {
        this.arrCategory = data.response_data;
        this.filter = data.response_data;
        this.loading1 = false;
        console.log(this.arrCategory);
      })
    }
  }

  btnReload() {
    this.arrCategory = [];
    this.arrListCategorys = [];
    this.strCategoryName = "";
    this.loading = true;
    this.loading1 = true;
    this.getCategory();
  }

  filterCategoryName(value: any) {

    this.arrCategory = this.filter.filter(option =>
      option.product_category_name.toLowerCase().indexOf(value.toLowerCase()) > -1).slice(0, 10);


    return this.arrCategory.filter(option =>
      option.product_category_name.toLowerCase().indexOf(value.toLowerCase()) > -1).slice(0, 10);
  }


  btnRowCate(e) {
    if (e.type == "click") {
      console.log(e.row);
      this.router.navigate([this.UrlRouter_Browse_Detail, e.row.distributor_id, "category"], { queryParams: { filterBy: this.strCategory } });
    }
  }

  refreshCate() {
    this.strCategoryName = "";
    this.filterCategoryName("");
  }


}
