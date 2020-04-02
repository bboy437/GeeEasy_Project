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
import { FormBuilder, FormGroup } from '@angular/forms';

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
  Form: FormGroup;
  private UrlRouter_Browse_Detail = "distributors/browse-distributor/detail";
  loading = false;
  strsupCate = '';
  ColumnMode = ColumnMode;

  constructor(
    private distributorAPIService: DistributorAPIService,
    private router: Router,
    private route: ActivatedRoute,
    private browseSupplierAPIService: BrowseSupplierAPIService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.Form = this.formBuilder.group({
      strproduct: [],
    });
    this.Form.get('strproduct').patchValue(this.name);
    // this.strproduct = this.name;
    this.filterProduct(this.name);
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
      const valueProduct =
        "cur_page=" +
        1 +
        "&per_page=" +
        10 +
        "&search_text=" +
        value

      this.browseSupplierAPIService.getProductDist(valueProduct).subscribe(data => {
        this.arrProducts = data.response_data;
        console.log(this.arrProducts);

        if (this.arrProducts.length > 0) {
          this.isSearchbyproduct = "data";
        } else {
          this.isSearchbyproduct = "Nodata";
        }
        this.loading = false;
      });
    } else {
      this.isSearchbyproduct = "Nodata";
      this.arrProducts = null;
      this.loading = false;
    }
  }

  btnDialogSavelists(data: any) {
    // const dialogRef = this.dialogService.open(DialogsSavedListComponent, {
    //   context: {
    //     data: data,
    //     isData: 'new'
    //   }
    // });
    // dialogRef.onClose.subscribe(result => {
    //   console.log(result);
    //   if (result) {
    //   }
    // });
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
      // this.getSupplierProducts(this.strproduct);
      // this.getSupplierName(this.strname);
      // this.getCategory()
    })

  }


  // btnRowProduct(row: any) {
  //   this.router.navigate([this.UrlRouter_Browse_Detail, row, "product"], {
  //     queryParams: { filterBy: this.strproduct }
  //   });
  // }

  btnRowProduct(e) {
    // tslint:disable-next-line: triple-equals
    if (e.type == "click") {
      console.log(e.row);
      this.router.navigate([this.UrlRouter_Browse_Detail, e.row.distributor_id, "product"], { queryParams: { filterBy: this.Form.value.strproduct } });
    }
    // this.router.navigate([this.UrlRouter_Browse_Detail, row, "product"], { queryParams: { filterBy: this.strproduct } });
  }

  btnRefreshProduct() {
    this.getSupplierProducts('');
    this.Form.get('strproduct').patchValue('')
  }


}
