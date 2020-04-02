import { Component, OnInit, ViewChild, PipeTransform, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { SortEvent, NgbdSortableHeader, SupplierAPIService } from '@project/services';
import { BillsableService } from './bills-table.service';
import { IBillList } from '@project/interfaces';

@Component({
  selector: 'project-bills-list',
  templateUrl: './bills-list.component.html',
  styleUrls: ['./bills-list.component.scss'],
  providers: [BillsableService, DecimalPipe]
})
export class BillsListComponent implements OnInit {
  daterangepickerModel: Date[];
  DateSelected = new Date();
  private UrlRouter_PurchaseDetail = "bills/detail";
  arrBills: any = [];
  formControl = new FormControl(new Date());
  arrBills$: Observable<IBillList[]>;
  total$: Observable<number>;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  Form: FormGroup;
  arrSuppler: any = [];
  strPONo: string;
  strStatus: string;
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
  ) {

    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);

    this.loading = true;

    // this.service.sortColumn = 'Status';
    // this.service.sortDirection = 'desc';
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

    this.getSupplier();
    this.callApi(e => {
      // completed
    });

  }

  callApi(callback) {
    this.service.refresh(e => {
      this.arrBills$ = this.service.countries$;
      this.total$ = this.service.total$;
      this.loading = false;
      callback(true);
    });
  }

  btnReload() {
    this.isReload = true;
    this.service.refresh(e => {
      this.arrBills$ = this.service.countries$;
      this.total$ = this.service.total$;
      this.isReload = false;
    });
  }


  getSupplier() {
    const value = "cur_page=" + 1 + "&per_page=" + 10 + "&search_text=" + "" + "&distributor_id=" + this.id_local + "&product_category_id=" + 0;
    this.supplierAPIService.getVerifiedSupplieList(value).subscribe(data => {
      this.arrSuppler = data.response_data;
      console.log(this.arrSuppler);
    })
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
      this.service.searchTerm3 = "0";
    }
    if (this.Form.value.strStatus === "Partially") {
      this.service.searchTerm2 = "2";
      this.service.searchTerm3 = "0";
    }
    if (this.Form.value.strStatus === "Completed") {
      this.service.searchTerm2 = "1";
      this.service.searchTerm3 = "1";
    }

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


  btnRefresh() {
    this.Form.get('strPONo').patchValue('');
    this.service.searchTerm = "";
  }

}