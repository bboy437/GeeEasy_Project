
import { Router, ActivatedRoute } from "@angular/router";
import { Component, OnInit, Input } from "@angular/core";
import {
  DistributorAPIService,
  BrowseSupplierAPIService,
  SaveListSupplierAPIService
} from "@project/services";
// import { DialogsSavedListComponent } from "../../../dialogs/dialogs-saved-list/dialogs-saved-list.component";
import { NbDialogService } from "@nebular/theme";
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'project-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  @Input() name: string;

  arrListCategorys: any = [];
  isButton: string;
  isSearchbyCategory = "false";
  strStatus: string;
  strCategory: string;
  Form: FormGroup;
  private UrlRouter_Browse_Detail = "distributors/browse-distributor/detail";
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

  constructor(
    private distributorAPIService: DistributorAPIService,
    private router: Router,
    private route: ActivatedRoute,
    private browseSupplierAPIService: BrowseSupplierAPIService,
    private formBuilder: FormBuilder,
  ) {

  }

  ngOnInit() {
  
  }

 
  categoryEvent(data) {
    console.log('data', data);
    console.log('product_category__id', data.product_category__id);
    this.loading1 = true;
    if (data.product_category__id !== 0) {
      this.distributorAPIService.getDistCate(data.product_category__id).subscribe(res => {
        console.log(res);
        this.arrListCategorys = res.response_data;
        this.loading1 = false;
      })

    } else {
      this.arrListCategorys = [];
      this.loading1 = false;
    }

  }


  btnDialogWishlist(data: any) {
    if (data.distributor_is_wish === 1) {
      data.distributor_is_wish = 0;
    } else {
      data.distributor_is_wish = 1;
    }
    const dataJsons = {
      "distributor_id": data.distributor_id,
      "supplier_id": 13356,
    }
    console.log('dataJsons', dataJsons);
    this.distributorAPIService.addWishList(JSON.stringify(dataJsons)).subscribe(res => {
    })

  }


  btnRowCate(e) {
    if (e.type === "click") {
      console.log(e.row);
      this.router.navigate([this.UrlRouter_Browse_Detail, e.row.distributor_id, "category"], { queryParams: { filterBy: this.Form.value.strCategoryName } });
    }
  }


}
