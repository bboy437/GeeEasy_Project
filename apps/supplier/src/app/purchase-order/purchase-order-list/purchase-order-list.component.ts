import { Component, OnInit, ViewChild, PipeTransform, QueryList, ViewChildren } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { IPurchaseList } from '@project/interfaces';
import { SortEvent, NgbdSortableHeader, SupplierAPIService, PurchaseAPIService, DistributorAPIService } from '@project/services';
import { PurchaseTableService } from './purchase-table.service';


@Component({
  selector: 'project-purchase-order-list',
  templateUrl: './purchase-order-list.component.html',
  styleUrls: ['./purchase-order-list.component.scss'],
  providers: [PurchaseTableService, DecimalPipe]
})
export class PurchaseOrderListComponent implements OnInit {

  daterangepickerModel: Date[];
  disabledDates = [
    new Date(),
    new Date()
  ];
  voneMonthAgo = new Date(
    new Date().getFullYear(),
    new Date().getMonth() - 5,
    new Date().getDate()
  );
  strSupplerName: string
  strPONo: string
  strStatus: string
  private UrlRouter_PurchaseDetail = "purchases/detail";
  private UrlRouter_Purchasesave = "purchases/save";
  private UrlRouter_Messages = "messages/list";
  arrOrder: any = [];
  formControl = new FormControl(new Date());
  arrPurchase$: Observable<IPurchaseList[]>;
  total$: Observable<number>;
  arrSuppler: any = [];
  Form: FormGroup;
  isStatus = false;
  name = "";
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  loading = false;
  isReload = false;
  arrDistributor: any = [];

  id_local: string;

  constructor(
    public service: PurchaseTableService,
    private router: Router,
    private supplierAPIService: SupplierAPIService,
    private purchaseAPIService: PurchaseAPIService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
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
    this.Builder();

    this.callApi(e => {
      // completed
    });

    const params = this.route.snapshot.paramMap;
    if (params.has("id")) {
      this.getDistributor();
      this.name = params.get("id");
      this.isStatus = true;

    } else {
      this.getDistributor();

    }
  }

  Builder() {
    this.Form = this.formBuilder.group({
      multiproperty: [],
      strPONo: [],
      strStatus: [],
      daterangepickerModel: [],
    });
    // this.Form.get('daterangepickerModel').patchValue(this.arrobjRow.group_parent_id);
  }



  callApi(callback) {
    this.service.getData(e => {
      this.arrPurchase$ = this.service.countries$;
      this.total$ = this.service.total$;
      this.loading = false;
      callback(true);
    });
  }

  btnReload() {

    this.isReload = true;
    this.service.getData(e => {
      this.arrPurchase$ = this.service.countries$;
      this.total$ = this.service.total$;
      this.isReload = false;
    });
  }

  btnRefresh() {
    this.service.searchTerm = "";
    this.strPONo = ""
  }

  getDistributor() {
    const value = "cur_page=" + 1 + "&per_page=" + 20 + "&supplier_id=" + this.id_local;
    this.distributorAPIService.getVerifiedDistList(value).subscribe(data => {
      this.arrDistributor = data.response_data;
      console.log('this.arrDistributor', this.arrDistributor);

    });
  }



  getSupplier() {
    const value = "cur_page=" + 1 + "&per_page=" + 10 + "&search_text=" + "" + "&distributor_id=" + 110 + "&product_category_id=" + 0;
    this.supplierAPIService.getVerifiedSupplieList(value).subscribe(data => {
      this.arrSuppler = data.response_data;
      this.strSupplerName = this.name;
      this.Form.value.multiproperty = this.name;
      console.log(this.strSupplerName);
    })
  }

  onValueChange(value: Date[]): void {
    // this.daterangepickerModel = value;
  }


  btnReset() {
    this.Form.get('strPONo').patchValue('')
    this.Form.get('strStatus').patchValue('')
    this.Form.get('multiproperty').patchValue([])
    this.Form.get('daterangepickerModel').patchValue(null)
    this.service.searchTerm = '';
    this.service.searchTerm1 = '';
    this.service.searchStatus1 = "";
    this.service.searchStatus2 = "";
    this.service.searchStatus3 = "";
    this.service.searchStatus4 = "";
    this.service.startDate = (new Date(this.voneMonthAgo)).getTime() / 1000;
    this.service.endDate = (new Date()).getTime() / 1000;
  }

  filterPoNo(value) {
    this.service.searchTerm = value;
  }

  filterDistributorName(event: any) {
    console.log('event', event);
    console.log('Form', this.Form.value.multiproperty);
    if (event.length === 0) {
      console.log('1');
      this.service.searchTerm1 = '';
    } else {
      console.log('2');
      this.service.searchTerm1 = this.Form.value.multiproperty;
    }

  }
  filterDate(value: Date[]): void {
    if (value !== null) {
      this.service.startDate = (new Date(value[0])).getTime() / 1000;
      this.service.endDate = (new Date(value[1])).getTime() / 1000;
    }
  }

  filterStatus(event: any) {
    console.log('event', event);
    if (event === "0" || event === "1" || event === "2" || event === "3") {
      this.service.searchStatus1 = this.Form.value.strStatus;
      this.service.searchStatus2 = "";
      this.service.searchStatus3 = "";
      this.service.searchStatus4 = "";
    } else if (event === "4") {
      this.service.searchStatus1 = "";
      this.service.searchStatus2 = "1";
      this.service.searchStatus3 = "";
      this.service.searchStatus4 = "";
    } else if (event === "5") {
      this.service.searchStatus1 = "";
      this.service.searchStatus2 = "";
      this.service.searchStatus3 = "1";
      this.service.searchStatus4 = "";
    } else if (event === "6") {
      this.service.searchStatus1 = "";
      this.service.searchStatus2 = "";
      this.service.searchStatus3 = "";
      this.service.searchStatus4 = "1";
    } else {
      this.service.searchStatus1 = "";
      this.service.searchStatus2 = "";
      this.service.searchStatus3 = "";
      this.service.searchStatus4 = "";
    }
  }



  // btnFilter() {

  //   const multiproperty = this.Form.value.multiproperty;
  //   console.log('multiproperty', multiproperty);

  //   if (this.strPONo === undefined || this.strPONo === '') {
  //     this.strPONo = ''
  //     this.service.searchTerm = '';
  //   } else {
  //     this.service.searchTerm = this.strPONo;
  //   }
  //   if (this.strSupplerName === undefined || this.strSupplerName === '') {
  //     this.strSupplerName = ''
  //     this.service.searchTerm1 = multiproperty;;
  //   } else {
  //     this.service.searchTerm1 = multiproperty;
  //   }
  //   if (this.strStatus === undefined || this.strStatus === '') {
  //     this.strStatus = ''
  //     this.service.searchTerm2 = '';
  //   } else {
  //     this.service.searchTerm2 = this.strStatus;
  //   }
  //   if (this.daterangepickerModel === undefined || this.daterangepickerModel === null) {
  //     this.daterangepickerModel = null;
  //     this.service.startDate = (new Date(this.voneMonthAgo)).getTime() / 1000;
  //     this.service.endDate = (new Date()).getTime() / 1000;
  //   } else {

  //     this.service.startDate = (new Date(this.daterangepickerModel[0])).getTime() / 1000;
  //     this.service.endDate = (new Date(this.daterangepickerModel[1])).getTime() / 1000;
  //   }
  //   // // this.purchaseAPIService.dataFilterList(value);

  // }

  btnNewClick() {
    this.router.navigate([this.UrlRouter_Purchasesave, { id: "new" }]);
  }

  onPageChange(event) {
    this.service.pageSize = event;
  }


  btnRowClick(row: any) {
    this.router.navigate([this.UrlRouter_PurchaseDetail, row]);
  }

  btnBackClick(row: any) {
    this.router.navigate([this.UrlRouter_Messages]);
  }

}