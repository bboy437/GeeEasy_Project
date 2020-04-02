import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { DistributorAPIService } from '@project/services';
import { Router } from '@angular/router';
import { VerifedTableService } from './verifed-table-list.service';
import { DecimalPipe } from '@angular/common';
import { IDistVerifed } from '@project/interfaces';
import { NgbdSortableHeader, SortEvent } from '@project/services';
import { Observable } from 'rxjs';
import { DialogsSavedListComponent } from '../../../dialogs/dialogs-saved-list/dialogs-saved-list.component';
import { NbDialogService } from '@nebular/theme';
import { ColumnMode } from '@swimlane/ngx-datatable';

@Component({
  selector: 'project-verifed-list',
  templateUrl: './verifed-list.component.html',
  styleUrls: ['./verifed-list.component.scss'],
  providers: [VerifedTableService, DecimalPipe]
})
export class VerifedListComponent implements OnInit {

  private UrlRouter_VerifedDetail = "distributors/veriferd/detail";
  arrDistributor: any = [];
  arrDistributorDetail: any = [];
  arrDistributorCate: any = [];
  filters: any = [];
  myverifed$: Observable<IDistVerifed[]>;
  totalList$: Observable<number>;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  isCheckData: string;
  id: string;
  loading = false;
  isReload = false;
  strname: string;
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

  constructor(
    private distributorAPIService: DistributorAPIService,
    private router: Router,
    public service: VerifedTableService,
    private dialogService: NbDialogService
  ) {
    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);
    this.loading = true;
  }

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
    // this.getDistributor();
    // this.getCategory();
    this.callApi(e => {
      // completed
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

    this.isReload = true;
    this.service.getData(e => {
      this.myverifed$ = this.service.countries$;
      this.totalList$ = this.service.total$;
      this.isReload = false;
    });
  }

  btnRefresh() {
    this.service.searchTerm = "";
  }

  getCategory() {
    const supplier_id = this.id_local;
    this.distributorAPIService.getVerifiedCate(supplier_id).subscribe(data => {
      this.arrDistributorCate = data.response_data;
      this.filters = data.response_data;
      console.log(this.arrDistributorCate);

      // this.getDistributor(this.arrDistributorCate[0])
    })
  }

  btnClickItem(data) {
    this.loading = true;
    const catalog = data
    this.getDistributor(catalog);

  }

  getDistributor(catalog) {
    this.id = catalog;
    const value = "cur_page=" + 1 + "&per_page=" + 10 + "&supplier_id=" + this.id_local + "&catalog=" + this.id;
    this.distributorAPIService.getVerifiedDistList(value).subscribe(data => {
      console.log(data.response_data);

      if (data.response_data.length > 0) {
        this.arrDistributor = data.response_data;
      } else {
        this.arrDistributor = [];
      }
      this.loading = false;
    })
  }



  btnDialogSavelists(data) {
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

  btnRowClick() {
    this.router.navigate([this.UrlRouter_VerifedDetail, this.arrDistributor.distributor_id]);
  }

  btnRow(e) {
    if (e.type == "click") {
      console.log(e.row);
      this.router.navigate([this.UrlRouter_VerifedDetail, e.row.distributor_id]);
    }
  }


  filter(value: any) {
    this.arrDistributorCate = this.filters.filter(option =>
      option.toLowerCase().indexOf(value.toLowerCase()) > -1).slice(0, 10);
    return this.arrDistributorCate.filter(option =>
      option.toLowerCase().indexOf(value.toLowerCase()) > -1).slice(0, 10);

  }


}
