
import { BrowseSupplierAPIService, SupplierAPIService } from '@project/services';
import { Router, ActivatedRoute } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { DialogsSupplierWishlistComponent } from '../../../dialogs/dialogs-supplier-wishlist/dialogs-supplier-wishlist.component';
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
    this.loading = true;
    this.loading1 = true;
    // this.getCategory();

  }

  categoryEvent(data) {
    console.log('data', data);
    console.log('product_category__id', data.product_category__id);
    this.loading1 = true;
    if (data.product_category__id !== 0) {
      const distributor_id = "?distributor_id=" + this.id_local
      this.browseSupplierAPIService.getCategoryID(data.product_category__id + distributor_id).subscribe(res => {
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

  // getCategory() {
  //   this.strsupCate = '';
  //   this.id = "";
  //   const valueCategory = 'cur_page=' + 1 + '&per_page=' + 10
  //   this.browseSupplierAPIService.getCategory(valueCategory).subscribe(data => {
  //     this.arrCategory1 = data.response_data;
  //     this.filter = data.response_data;
  //     console.log(this.arrCategory1);
  //     this.loading = false;
  //     this.loading1 = false;
  //   })
  // }

  // subCate(product_category_child_array, product_category_id, product_category_name) {
  //   // if (e.type == "click") {
  //   //   console.log(e.row.product_category_child_array);
  //   //   const product_category_child_array = e.row.product_category_child_array
  //   //   const product_category_id = e.row.product_category_id
  //   //   const product_category_name = e.row.product_category_name

  //   this.loading1 = true;
  //   this.strsupCate = product_category_name;
  //   this.id = product_category_id;
  //   const distributor_id = "?distributor_id=" + this.id_local
  //   this.browseSupplierAPIService.getCategoryID(product_category_id + distributor_id).subscribe(res => {
  //     this.arrListCategorys = res.response_data;
  //     console.log('arrListCategorys', this.arrListCategorys);
  //     this.loading1 = false;
  //   })

  //   if (product_category_child_array.length > 0) {
  //     const valueCategory = 'cur_page=' + 1 + '&per_page=' + 10 + '&product_category_id=' + product_category_id
  //     this.browseSupplierAPIService.getCategory(valueCategory).subscribe(data => {
  //       this.arrCategory1 = data.response_data;
  //       this.filter = data.response_data;
  //       this.loading1 = false;
  //       console.log(this.arrCategory1);
  //     })
  //   }
  //   // }
  // }

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
