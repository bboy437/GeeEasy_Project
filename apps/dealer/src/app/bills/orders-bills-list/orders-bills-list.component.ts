import { Component, OnInit, ViewChild, PipeTransform, QueryList, ViewChildren } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { SortEvent, NgbdSortableHeader, DealerAPIService, OrderAPIService, DistributorAPIService } from '@project/services';
import { OrdersTableService } from './table.service';
import { IOrderList } from '@project/interfaces';

@Component({
  selector: 'project-orders-bills-list',
  templateUrl: './orders-bills-list.component.html',
  styleUrls: ['./orders-bills-list.component.scss'],
  providers: [OrdersTableService, DecimalPipe]
})
export class OrdersBillsListComponent implements OnInit {
  ;
  private UrlRouter_PurchaseDetail = "bills/order/detail";
  private UrlRouter_Purchasesave = "orders/save";
  private UrlRouter_PurchaseBack = "dealers/list";
  formControl = new FormControl(new Date());
  arrOrder$: Observable<IOrderList[]>;
  total$: Observable<number>;
  arrDealer: any = [];
  arrDistributor: any = [];
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  Form: FormGroup;
  loading = false;
  isReload = false;
  isStatus = false;
  name = "";

  voneMonthAgo = new Date(
    new Date().getFullYear(),
    new Date().getMonth() - 5,
    new Date().getDate()
  )

  constructor(
    public service: OrdersTableService,
    private router: Router,
    private dealerAPIService: DealerAPIService,
    private formBuilder: FormBuilder,
    private orderAPIService: OrderAPIService,
    private route: ActivatedRoute,
    private distributorAPIService: DistributorAPIService
  ) {
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
      this.getDistrbutor();
      this.name = params.get("id");
      this.isStatus = true;
      console.log(' this.name', this.name);

      this.service.searchTerm1 = this.name;

    } else {
      this.getDistrbutor();
      this.isStatus = false;
    }
  }

  Builder() {
    this.Form = this.formBuilder.group({
      multiproperty: [],
      strOrder: [],
      strStatus: [],
      strShipmentStatus: [],
      daterangepickerModel: [],
    });
  }

  callApi(callback) {
    this.service.getData(e => {
      this.arrOrder$ = this.service.countries$;
      this.total$ = this.service.total$;
      this.loading = false;
      callback(true);
    });
  }

  btnReload() {

    this.isReload = true;
    this.service.getData(e => {
      this.arrOrder$ = this.service.countries$;
      this.total$ = this.service.total$;
      this.isReload = false;
    });
  }


  getDistrbutor() {
    const value = "cur_page=" + 1 + "&per_page=" + 100;
    this.distributorAPIService.getDistList(value).subscribe(data => {
      this.arrDistributor = data.response_data;
      console.log(this.arrDistributor);

    })
  }

  getDealer() {
    const value = "cur_page=" + 1 + "&per_page=" + 10;
    this.dealerAPIService.getDealerList(value).subscribe(data => {
      this.arrDealer = data.response_data;
    })
  }

  filterOrderNo(value) {
    this.service.searchTerm = value;
  }

  filterDealerName(event: any) {
    console.log(event);

    if (event.length === 0) {
      this.service.searchTerm1 = '';
    } else {
      const multiproperty = this.Form.value.multiproperty;
      this.service.searchTerm1 = multiproperty;
    }

  }
  filterDate(value: Date[]): void {
    if (value !== null) {
      this.service.startDate = (new Date(value[0])).getTime() / 1000;
      this.service.endDate = (new Date(value[1])).getTime() / 1000;
    }
  }

  filterStatus(event: any) {
    this.service.searchTerm2 = this.Form.value.strStatus;
  }

  filterShipmentStatus(event: any) {
    this.service.searchTerm3 = this.Form.value.strShipmentStatus;
  }




  btnReset() {
    this.Form.get('strOrder').patchValue('')
    this.Form.get('strStatus').patchValue('')
    this.Form.get('strShipmentStatus').patchValue('')
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
    this.service.searchTerm = '';
    this.Form.get('strOrder').patchValue('')
  }


  btnNewClick() {
    this.router.navigate([this.UrlRouter_Purchasesave, "new"]);
  }


  btnRowClick(row: any) {
    this.router.navigate([this.UrlRouter_PurchaseDetail, row, this.name]);
  }

  btnBackClick() {
    this.router.navigate([this.UrlRouter_PurchaseBack]);
  }

  onPageChange(event) {
    this.service.pageSize = event;
  }

}