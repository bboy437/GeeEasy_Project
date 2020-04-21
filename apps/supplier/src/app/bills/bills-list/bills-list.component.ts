import { Component, OnInit, ViewChild, PipeTransform, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { SortEvent, NgbdSortableHeader, SupplierAPIService, DistributorAPIService } from '@project/services';
import { BillsableService } from './bills-table.service';
import { IBillList } from '@project/interfaces';

@Component({
  selector: 'project-bills-list',
  templateUrl: './bills-list.component.html',
  styleUrls: ['./bills-list.component.scss'],
  providers: [BillsableService, DecimalPipe]
})
export class BillsListComponent implements OnInit {

  arrSelect = [
    {name: 'All Status', value: 'All Status'},
    {name: 'Unpaid', value: 'Unpaid'},
    {name: 'Partially', value: 'Partially'},
    {name: 'Paid', value: 'Paid'},

  ]

  daterangepickerModel: Date[];
  DateSelected = new Date();
  private UrlRouter_PurchaseDetail = "bills/detail";
  arrBills: any = [];
  formControl = new FormControl(new Date());
  arrBills$: Observable<IBillList[]>;
  total$: Observable<number>;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  Form: FormGroup;
  strPONo: string;
  strStatus: string;
  arrDistributor: any = [];
  loading = false;
  isReload = false;

  voneMonthAgo = new Date(
    new Date().getFullYear(),
    new Date().getMonth() - 5,
    new Date().getDate()
  );

  id_local: string;


  constructor(
    public service: BillsableService,
    private router: Router,
    private supplierAPIService: SupplierAPIService,
    private formBuilder: FormBuilder,
    private distributorAPIService: DistributorAPIService
  ) {
    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);
    this.loading = true;

  }

  onSort({ column, direction }: SortEvent) {
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }


  ngOnInit() {
    this.Form = this.formBuilder.group({
      multiproperty: [],
      strPONo: [],
      strStatus: [],
      daterangepickerModel: [],
    });

    this.getDistributor();
    this.callApi(e => {
      // completed
    });
  }

  callApi(callback) {
    this.service.getData(e => {
      this.arrBills$ = this.service.countries$;
      this.total$ = this.service.total$;
      this.loading = false;
      callback(true);
    });
  }

  btnReload() {

    this.isReload = true;
    this.service.getData(e => {
      this.arrBills$ = this.service.countries$;
      this.total$ = this.service.total$;
      this.isReload = false;
    });
  }

  btnRefresh() {
    this.service.searchTerm = "";
    this.Form.get('strPONo').patchValue('')
  }

  getDistributor() {
    const value = "cur_page=" + 1 + "&per_page=" + 20 + "&supplier_id=" + this.id_local;
    this.distributorAPIService.getVerifiedDistList(value).subscribe(data => {
      this.arrDistributor = data.response_data;
      console.log('this.arrDistributor', this.arrDistributor);

    });
  }


  btnRowClick(row: any) {
    this.router.navigate([this.UrlRouter_PurchaseDetail, row]);
  }

  filterPoNo(value) {
    this.service.searchTerm = value;
  }

  filterSupplierName(event: any) {
    if (event.length === 0) {
      this.service.searchTerm1 = '';
    } else {
      const multiproperty = this.Form.value.multiproperty;
      this.service.searchTerm1 = multiproperty;
    }

  }

  filterStatus(event: any) {
    if (this.Form.value.strStatus === "All Status") {
      this.service.searchTerm2 = "";
      this.service.searchTerm3 = "";
    }
    if (this.Form.value.strStatus === "Unpaid") {
      this.service.searchTerm2 = "0";
      this.service.searchTerm3 = "0";
    }

    if (this.Form.value.strStatus === "Paid") {
      this.service.searchTerm2 = "1";
      // this.service.searchTerm3 = "1";
    }
    if (this.Form.value.strStatus === "Partially") {
      this.service.searchTerm2 = "2";
      this.service.searchTerm3 = "0";
    }
    // if (this.Form.value.strStatus === "Completed PO") {
    //   this.service.searchTerm2 = "1";
    //   this.service.searchTerm3 = "1";
    // }

  }

  filterDate(value: Date[]): void {
    if (value !== null) {
      this.service.startDate = (new Date(value[0])).getTime() / 1000;
      this.service.endDate = (new Date(value[1])).getTime() / 1000;
    }
  }


  btnReset() {
    console.log(this.Form.value.multiproperty);

    this.Form.get('strPONo').patchValue('')
    this.Form.get('strStatus').patchValue('')
    this.Form.get('multiproperty').patchValue([])
    this.Form.get('daterangepickerModel').patchValue(null)
    this.service.searchTerm = '';
    this.service.searchTerm1 = '';
    this.service.searchTerm2 = '';
    this.service.searchTerm3 = '';
    this.service.startDate = (new Date(this.voneMonthAgo)).getTime() / 1000;
    this.service.endDate = (new Date()).getTime() / 1000;
  }

}