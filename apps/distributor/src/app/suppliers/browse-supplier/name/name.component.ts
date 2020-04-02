import { BrowseSupplierAPIService, SupplierAPIService } from '@project/services';
import { Router, ActivatedRoute } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { DialogsSupplierWishlistComponent } from '../../../dialogs/dialogs-supplier-wishlist/dialogs-supplier-wishlist.component';
import { DialogsSupplierRequestComponent } from '../../../dialogs/dialogs-supplier-request/dialogs-supplier-request.component';
import { DialogsSavedListComponent } from '../../../dialogs/dialogs-saved-list/dialogs-saved-list.component';
import { Component, OnInit, Input } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';

@Component({
  selector: 'project-name',
  templateUrl: './name.component.html',
  styleUrls: ['./name.component.scss']
})
export class NameComponent implements OnInit {
  @Input() name: string;
  arrNames: any = [];
  isSearchbyname = "Nodata";
  strname: string;
  private UrlRouter_Browse_Detail = "suppliers/browse-suppliers/detail";
  loading = false;
  ColumnMode = ColumnMode;

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
    this.strname = this.name;
    this.filterName(this.strname);
  }


  filterName(value: any) {
    this.isSearchbyname = "Nodata";
    this.arrNames = null;
    const str = new String(value);
    const len = str.length;

    if (len <= 1)
      return

    this.loading = true;
    this.getSupplierName(value);
  }

  getSupplierName(value: any) {
    if (value) {
      const valueName = 'cur_page=' + 1 + '&per_page=' + 10 + '&search_text=' + value + "&distributor_id=" + this.id_local;
      this.browseSupplierAPIService.getSupplierName(valueName).subscribe(data => {
        const arrNames = data.response_data;
        if (arrNames.length > 0) {
          this.isSearchbyname = "data";
          const arrNamesNew = arrNames.filter((item, index) => {
            item.product_category_keyword = item.product_category_keyword.split(",").join(", ");
            item.supplier_company_contact = item.supplier_company_contact.split(",").join(", ");
            return true;
          });
          this.getCheckRequest(arrNamesNew);
        } else {
          this.isSearchbyname = "Nodata";
        }
        this.loading = false;
      })
    } else {
      this.isSearchbyname = "Nodata";
      this.arrNames = null;
      this.loading = false;
    }
  }


  getCheckRequest(arrNames) {
    console.log('arrProducts', arrNames);
    const arrNew = arrNames;
    arrNew.forEach(element => {
      const valueProduct = "distributor_id=" + this.id_local + "&supplier_id=" + element.supplier_id
      this.browseSupplierAPIService.getCheckReques(valueProduct).subscribe(res => {
        element.show_request_button = res.response_data[0].show_request_button;
      })
    });
    this.arrNames = arrNew;
    console.log('this.arrNames', this.arrNames);
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
      // this.getSupplierProducts(this.strproduct);
      // this.getSupplierName(this.strname);
      // this.getCategory()
    })

    // const dialogRef = this.dialogService.open(DialogsSupplierWishlistComponent, {
    //   context: {
    //     data: data
    //   }
    // });

    // dialogRef.onClose.subscribe(result => {
    // });
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
    console.log(data);

    const dialogRef = this.dialogService.open(DialogsSavedListComponent, {
      context: {
        data: data,
        isData: "new"
      }
    });

    dialogRef.onClose.subscribe(result => {
    });

  }



  btnRowName(e) {
    if (e.type == "click") {
      console.log(e.row);
      this.router.navigate([this.UrlRouter_Browse_Detail, e.row.supplier_id, "name"], { queryParams: { filterBy: this.strname } });
    }
  }

  refreshName() {
    this.strname = "";
    this.filterName("");
  }


}
