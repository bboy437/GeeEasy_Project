import { Component, OnInit, Input, } from '@angular/core';
import { Router } from '@angular/router';
import { SupplierAPIService } from '@project/services';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { DialogsSavedListComponent } from '../../../dialogs/dialogs-saved-list/dialogs-saved-list.component';
import { NbDialogService } from '@nebular/theme';
import { tap, catchError } from 'rxjs/operators';
import { EMPTY, Subject } from 'rxjs';

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
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();


  constructor(
    private router: Router,
    private supplierAPIService: SupplierAPIService,
    private dialogService: NbDialogService,
  ) {
    this.loading = true;
    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);
  }

  supplierList$ = this.supplierAPIService.supplierList$
    .pipe(
      tap((data) => this.loading = false),
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    );

  ngOnInit() {
    // this.getSupplier();
    this.supplierAPIService.categoryIDSelectedAction$.subscribe(res => this.strID = String(res))

  }

  clickCate(dataList) {
    console.log('dataList', dataList);
    this.loading = true;
    this.strID = dataList.id;
    this.strName = dataList.name;
    this.supplierAPIService.selectedCategorySupplier(dataList.id);
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
