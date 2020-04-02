import { Router, ActivatedRoute } from "@angular/router";
import { Component, OnInit, Input } from "@angular/core";
import {
  DistributorAPIService,
  BrowseSupplierAPIService,
  SaveListSupplierAPIService
} from "@project/services";
import { DialogsSavedListComponent } from "../../../dialogs/dialogs-saved-list/dialogs-saved-list.component";
import { NbDialogService } from "@nebular/theme";
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
  private UrlRouter_Browse_Detail = "distributors/browse-distributor/detail";
  loading = false;
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
    this.strname = this.name;
    this.filterName(this.strname);
  }


  filterName(value: any) {

    let str = new String(value);
    let len = str.length;
    console.log(str);
    console.log("The length of above string is : " + len);
    console.log("The length of above string is : " + (len <= 1));
    if (len <= 1)
      return

    this.loading = true;
    this.getSupplierName(value);
  }

  btnRefreshName() {
    this.getSupplierName('');
    this.strname = '';
  }

  getSupplierName(value: any) {
    var str = new String(value)
    var len = str.length
    if (len < 1) {
      this.isSearchbyname = "Nodata";
      this.arrNames = null;
      this.loading = false;
      return
    }
    if (value) {
      const valueName = 'cur_page=' + 1 + '&per_page=' + 10 + '&search_text=' + value + "&supplier_id=" + this.id_local;
      this.browseSupplierAPIService.getNameDist(valueName).subscribe(data => {
        this.arrNames = data.response_data;
        console.log(' this.arrNames', this.arrNames);
        if (this.arrNames.length > 0) {
          this.isSearchbyname = "data";
        } else {
          this.isSearchbyname = "Nodata";
        }
        this.loading = false;
      });
    } else {
      this.isSearchbyname = "Nodata";
      this.arrNames = null;
      this.loading = false;
    }
  }

  btnDialogSavelists(data: any) {
    const dialogRef = this.dialogService.open(DialogsSavedListComponent, {
      context: {
        data: data,
        isData: 'new'
      }
    });
    dialogRef.onClose.subscribe(result => {
      console.log(result);
      if (result) {
      }
    });
  }

  btnDialogWishlist(data: any) {
    if (data.distributor_is_wish === 1) {
      data.distributor_is_wish = 0;
    } else {
      data.distributor_is_wish = 1;
    }
    const dataJsons = {
      "distributor_id": data.distributor_id,
      "supplier_id": this.id_local,
    }
    console.log('dataJsons', dataJsons);
    this.distributorAPIService.addWishList(JSON.stringify(dataJsons)).subscribe(res => {
      // this.getSupplierProducts(this.strproduct);
      // this.getSupplierName(this.strname);
      // this.getCategory()
    })

  }



  // btnRowName(row: any) {
  //   this.router.navigate([this.UrlRouter_Browse_Detail, row, "name"], { queryParams: { filterBy: this.strname } });
  // }

  btnRowName(e) {
    // tslint:disable-next-line: triple-equals
    if (e.type == "click") {
      console.log(e.row);
      this.router.navigate([this.UrlRouter_Browse_Detail, e.row.distributor_id, "name"], { queryParams: { filterBy: this.strname } });
    }

  }
}
