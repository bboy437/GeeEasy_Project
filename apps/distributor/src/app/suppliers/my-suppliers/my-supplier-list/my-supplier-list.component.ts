import { Component, OnInit, Input, } from '@angular/core';
import { Router } from '@angular/router';
import { SupplierAPIService } from '@project/services';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { DialogsSavedListComponent } from '../../../dialogs/dialogs-saved-list/dialogs-saved-list.component';
import { NbDialogService } from '@nebular/theme';

@Component({
  selector: 'project-my-supplier-list',
  templateUrl: './my-supplier-list.component.html',
  styleUrls: ['./my-supplier-list.component.scss']
})
export class MySupplierListComponent implements OnInit {
  @Input() strStatus: string;
  private UrlRouter_SupplierSave = "suppliers/save";
  loading = false;
  arrSupplier: any = [];
  arrSuppliers: any = [];
  strID: string;
  strName: string;
  ColumnMode = ColumnMode;
  private UrlRouter_SupplierDetail = "suppliers/detail";

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
    private router: Router,
    private supplierAPIService: SupplierAPIService,
    private dialogService: NbDialogService,
  ) {

    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);
  }




  ngOnInit() {
    // this.getSupplier();
    this.loading = true;
    this.clickCate([])
  }

  clickCate(dataList) {
    console.log('dataList', dataList);
    if (dataList.id !== undefined) {
      this.loading = true;
      this.strID = dataList.id;
      this.strName = dataList.name;
      const value = "cur_page=" + 1 + "&per_page=" + 10 + "&search_text=" + "" + "&distributor_id=" + this.id_local + "&product_category_id=" + dataList.id;
      this.supplierAPIService.getVerifiedSupplieList(value).subscribe(res => {
        this.arrSupplier = res.response_data;
        console.log('Suppliers', this.arrSupplier);
        // this.btnClickItem(this.arrSupplier[0])
        this.loading = false;
      })
    } else {
      this.loading = false;
    }

  }

  btnRow(e) {
    if (e.type == "click") {
      console.log(e.row);
      this.router.navigate([this.UrlRouter_SupplierDetail, e.row.supplier_id]);
    }
  }

  btnDialogSavelists(data: any) {
    const dialogRef = this.dialogService.open(DialogsSavedListComponent, {
      context: {
        data: data,
        isData: "new"
      }
    });

    dialogRef.onClose.subscribe(result => {
      // this.router.navigate([this.UrlRouter_Purchase]);
    });

  }


  getData(a: 1, b: 10, c: 1) {
    /*
    // default parameters
    let dataSend = {
      'cur_page': a,
      'per_page': b,
      'ditstributor_id': c
    };

    // condition 1
    if(currentPage !== 1){
      dataSend.cur_page = currentPage;
    }

    // condition 2
    if(yearsPerPage !== 1){
      dataSend.per_page = perPage;
    }

    // micro service end point
    this.supplierAPIService.getSomeData(dataSend).then(function(result){
      // ok
    }).catch(function(err){
      // error
    });*/

  }


  btnNewClick() {
    const id = 'new';
    this.router.navigate([this.UrlRouter_SupplierSave, id]);
  }


}
