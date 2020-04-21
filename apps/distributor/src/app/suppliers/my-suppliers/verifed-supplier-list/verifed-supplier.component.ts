import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { SupplierAPIService } from '@project/services';
import { Router } from '@angular/router';
import { VerifedTableService } from './table-list.service';
import { DecimalPipe } from '@angular/common';
import { ICategory } from '@project/interfaces';
import { NgbdSortableHeader, SortEvent } from '@project/services';
import { Observable, EMPTY, Subject } from 'rxjs';
import { DialogsSavedListComponent } from '../../../dialogs/dialogs-saved-list/dialogs-saved-list.component';
import { NbDialogService } from '@nebular/theme';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { tap, catchError } from 'rxjs/operators';

@Component({
  selector: 'project-verifed-supplier',
  templateUrl: './verifed-supplier.component.html',
  styleUrls: ['./verifed-supplier.component.scss'],
  providers: [VerifedTableService, DecimalPipe]
})
export class VerifedSupplierComponent implements OnInit {
  private UrlRouter_VerifedSupplierInformation = "suppliers/verifed/detail";
  loading = false;
  isReload = false;
  myverifed$: Observable<ICategory[]>;
  totalList$: Observable<number>;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  isCheckData: string;
  strFilter: string;
  id: number;
  strName: string;
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

  id_local: string;
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  constructor(
    private supplierAPIService: SupplierAPIService,
    private router: Router,
    public service: VerifedTableService,
    private dialogService: NbDialogService,
  ) {
    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);
    this.loading = true;
  }


  verifiedSupplierList$ = this.supplierAPIService.verifiedSupplierList$
    .pipe(
      tap((data) => this.loading = false),
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    );

  onSort({ column, direction }: SortEvent) {
    console.log({ column, direction });

    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }


  ngOnInit() {
    // this.getProductGroup();
    this.callApi(e => {
      this.supplierAPIService.veririedCategorySelectedAction$.subscribe(res => {
        console.log(res)
        this.id = res;
      })
    });
  }

  callApi(callback) {
    this.service.getData(e => {
      this.myverifed$ = this.service.countries$;
      this.totalList$ = this.service.total$;
      this.loading = false;
      callback(true);
    });
  }

  btnReload() {

    this.supplierAPIService.selectedCategoryVerifiesSupplier(null);
    this.isReload = true;
    this.service.getData(e => {
      this.myverifed$ = this.service.countries$;
      this.totalList$ = this.service.total$;
      this.isReload = false;
    });
  }

  getSupplier(supcate, id, name) {
    this.loading = true;
    this.id = id;
    this.strName = name;
    this.supplierAPIService.selectedCategoryVerifiesSupplier(id);
  }

  btnRow(e) {
    if (e.type == "click") {
      console.log(e.row);
      this.router.navigate([this.UrlRouter_VerifedSupplierInformation, e.row.supplier_id]);
    }
  }

  filter(value: any) {
    this.service.searchTerm = value;
  }

  btnRefresh() {
    this.strFilter = "";
    this.service.searchTerm = "";
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



}
