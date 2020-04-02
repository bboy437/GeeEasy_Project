import { BrowseSupplierAPIService, SupplierAPIService } from '@project/services';
import { Router, ActivatedRoute } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { DialogsSupplierRequestComponent } from '../../../dialogs/dialogs-supplier-request/dialogs-supplier-request.component';
import { DialogsSavedListComponent } from '../../../dialogs/dialogs-saved-list/dialogs-saved-list.component';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';

@Component({
  selector: 'project-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  @Input() name: string;
  arrProducts: any = [];
  isButton: string;
  isSearchbyproduct = "Nodata";
  strproduct: string;
  private UrlRouter_Browse_Detail = "suppliers/browse-suppliers/detail";
  loading = false;
  strsupCate = '';
  ColumnMode = ColumnMode;
  @ViewChild('myTable', { static: false }) table: any;

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
    this.strproduct = this.name;
    this.filterProduct(this.strproduct);
  }


  filterProduct(value: any) {
    this.isSearchbyproduct = "Nodata";
    this.arrProducts = null;
    const str = new String(value);
    const len = str.length;

    if (len <= 1)
      return
    this.loading = true;
    this.getSupplierProducts(value);
  }

  getSupplierProducts(value: any) {
    if (value) {
      const valueProduct = 'cur_page=' + 1 + '&per_page=' + 10 + '&search_text=' + value + "&distributor_id=" + this.id_local;
      this.browseSupplierAPIService.getSupplierProduct(valueProduct).subscribe(data => {
        const arrProducts = data.response_data;
        console.log(arrProducts);
        if (arrProducts.length > 0) {
          this.isSearchbyproduct = "data";
          const arrProductsNew = arrProducts.filter((item, index) => {
            item.product_category_keyword = item.product_category_keyword.split(",").join(", ");
            item.supplier_company_contact = item.supplier_company_contact.split(",").join(", ");
            return true;
          });
          this.getCheckRequest(arrProductsNew);

        } else {
          this.isSearchbyproduct = "Nodata";
        }
        this.loading = false;
      })
    } else {
      this.isSearchbyproduct = "Nodata";
      this.arrProducts = null;
      this.loading = false;
    }
  }

  getCheckRequest(arrProducts) {
    console.log('arrProducts', arrProducts);
    const arrNew = arrProducts;
    arrNew.forEach(element => {
      const valueProduct = "distributor_id=" + this.id_local + "&supplier_id=" + element.supplier_id
      this.browseSupplierAPIService.getCheckReques(valueProduct).subscribe(res => {
        element.show_request_button = res.response_data[0].show_request_button;
      })
    });
    this.arrProducts = arrNew;
    console.log('this.arrProducts', this.arrProducts);
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

  onUserEvent(e) {
    if (e.type == "click") {
      console.log(e.row);
    }
  }


  btnRowProduct(e) {
    if (e.type == "click") {
      console.log(e.row);
      this.router.navigate([this.UrlRouter_Browse_Detail, e.row.supplier_id, "product"], { queryParams: { filterBy: this.strproduct } });
    }
    // this.router.navigate([this.UrlRouter_Browse_Detail, row, "product"], { queryParams: { filterBy: this.strproduct } });
  }

  refreshProduct() {
    this.strproduct = "";
    this.filterProduct("");
  }


}
