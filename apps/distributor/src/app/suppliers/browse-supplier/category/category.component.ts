
import { BrowseSupplierAPIService, SupplierAPIService } from '@project/services';
import { Router, ActivatedRoute } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { DialogsSupplierRequestComponent } from '../../../dialogs/dialogs-supplier-request/dialogs-supplier-request.component';
import { DialogsSavedListComponent } from '../../../dialogs/dialogs-saved-list/dialogs-saved-list.component';
import { Component, OnInit, Input } from '@angular/core';
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
  arrCategory1: any = [];
  isButton: string;
  isSearchbyCategory = "false";
  strStatus: string;
  strCategory: string;
  strCategoryName: string;
  private UrlRouter_Browse_Detail = "suppliers/browse-suppliers/detail";
  loading = false;
  loading1 = false;
  strsupCate = '';
  ColumnMode = ColumnMode;
  id: string;
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
    private browseSupplierAPIService: BrowseSupplierAPIService,
    private supplierAPIService: SupplierAPIService,
    private router: Router,
    private dialogService: NbDialogService,
    private route: ActivatedRoute,
  ) {
    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);

  }

  ngOnInit() {
    this.strCategory = this.name;
  }

  categoryEvent(data) {
    console.log('data', data);
    this.loading1 = true;
    if (data.product_category__id !== 0) {
      const param = data.product_category__id + "?distributor_id=" + this.id_local
      this.browseSupplierAPIService.getCategoryID(param).subscribe(res => {
        const arrListCategorys = res.response_data;
        console.log('arrListCategorys', this.arrListCategorys);
        this.getCheckRequest(arrListCategorys)
        this.loading1 = false;
      })

    } else {
      this.arrListCategorys = [];
      this.loading1 = false;
    }

  }

  getCheckRequest(arrListCategorys) {
    console.log('arrListCategorys', arrListCategorys);
    const arrListCategorysNew = arrListCategorys;
    arrListCategorysNew.forEach(element => {
      const valueProduct = "distributor_id=" + this.id_local + "&supplier_id=" + element.supplier_id
      this.browseSupplierAPIService.getCheckReques(valueProduct).subscribe(res => {
        element.show_request_button = res.response_data[0].show_request_button;
      })
    });
    this.arrListCategorys = arrListCategorysNew;
    console.log('this.arrNames', this.arrListCategorys);
  }


  btnReload() {
    this.arrCategory1 = [];
    this.arrListCategorys = [];
    this.strCategoryName = "";
    this.loading = true;
    this.loading1 = true;
    // this.getCategory();
  }


  filterCategoryName(value: any) {

    this.arrCategory1 = this.filter.filter(option =>
      option.product_category_name.toLowerCase().indexOf(value.toLowerCase()) > -1);

    // if (this.arrCategorys.length === 0) {
    //   this.isSearchbyCategoryName = "Nodata";
    //   this.isSearchbyCategory = "Nodata";
    // }
    return this.arrCategory1.filter(option =>
      option.product_category_name.toLowerCase().indexOf(value.toLowerCase()) > -1);

  }


  btnDialogWishlist(data: any) {
    console.log(data);

    if (data.supplier_is_wish === 1) {
      data.supplier_is_wish = 0;
    } else {
      data.supplier_is_wish = 1;
    }

    const dataJsons = {
      "distributor_id": this.id_local,
      "supplier_id": data.supplier_id,
    }
    console.log(dataJsons);

    const dataJson = JSON.stringify(dataJsons);
    this.supplierAPIService.addWishList(dataJson).subscribe(res => {
    })


  }

  btnDialogRequest(data: any) {

    const dialogRef = this.dialogService.open(DialogsSupplierRequestComponent, {
      context: {
        data: data,
      },
    });

    dialogRef.onClose.subscribe(result => {
      if (result === 'ok') {
        data.show_request_button = 0;
      }
    });

  }

  btnDialogRequested(data: any) {

  }

  btnDialogSavelists(data: any) {
    const dialogRef = this.dialogService.open(DialogsSavedListComponent, {
      context: {
        data: data,
        isData: "new"
      }
    });

    dialogRef.onClose.subscribe(result => {
    });

  }


  btnRowCate(e) {
    if (e.type == "click") {
      console.log(e.row);
      this.router.navigate([this.UrlRouter_Browse_Detail, e.row.supplier_id, "category"], { queryParams: { filterBy: this.strCategory } });
    }
  }

  refreshCate() {
    this.strCategoryName = "";
    this.filterCategoryName("");
  }


}
