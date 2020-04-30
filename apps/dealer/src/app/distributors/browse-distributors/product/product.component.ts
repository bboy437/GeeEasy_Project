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
  private UrlRouter_Browse_Detail = "distributors/browse-distributor/detail";
  loading = false;
  strsupCate = '';
  ColumnMode = ColumnMode;

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
    this.strproduct = this.name;
    this.filterProduct(this.strproduct);
  }


  filterProduct(value: any) {
    console.log(value);

    let str = new String(value);
    let len = str.length;
    console.log(str);
    console.log("The length of above string is : " + len);
    console.log("The length of above string is : " + (len <= 1));
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
        value +
        "&supplier_id=" +
        this.id_local;
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

  
  // btnRowProduct(row: any) {
  //   this.router.navigate([this.UrlRouter_Browse_Detail, row, "product"], {
  //     queryParams: { filterBy: this.strproduct }
  //   });
  // }

  btnRowProduct(e) {
    // tslint:disable-next-line: triple-equals
    if (e.type == "click") {
      console.log(e.row);
      this.router.navigate([this.UrlRouter_Browse_Detail, e.row.distributor_id, "product"], { queryParams: { filterBy: this.strproduct } });
    }
    // this.router.navigate([this.UrlRouter_Browse_Detail, row, "product"], { queryParams: { filterBy: this.strproduct } });
  }

  btnRefreshProduct() {
    this.getSupplierProducts('');
    this.strproduct = '';
  }


}
