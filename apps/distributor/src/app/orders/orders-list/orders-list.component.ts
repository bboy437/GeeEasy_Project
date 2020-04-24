import { Component, OnInit, ViewChild, PipeTransform, QueryList, ViewChildren } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { SortEvent, NgbdSortableHeader, DealerAPIService, OrderAPIService } from '@project/services';
import { OrdersTableService } from './orders-table.service';
import { IOrderList } from '@project/interfaces';

@Component({
  selector: 'project-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss'],
  providers: [OrdersTableService, DecimalPipe]
})
export class OrdersListComponent implements OnInit {

  daterangepickerModel: Date[];
  bsValue = new Date();
  DateSelected = new Date();
  date = new Date();
  date1 = new Date();
  private UrlRouter_PurchaseDetail = "orders/detail";
  private UrlRouter_Purchasesave = "orders/save";
  private UrlRouter_PurchaseBack = "dealers/list";
  arrOrder: any = [];
  formControl = new FormControl(new Date());
  arrOrder$: Observable<IOrderList[]>;
  total$: Observable<number>;
  arrDealer: any = [];
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  Form: FormGroup;
  strOrder: string;
  strStatus: string;
  strShipmentStatus: string;
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
      this.getDealer();
      this.name = params.get("id");
      this.isStatus = true;
      console.log(' this.name', this.name);

      this.service.searchTerm1 = this.name;

    } else {
      this.getDealer();
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
    // this.Form.get('daterangepickerModel').patchValue(this.arrobjRow.group_parent_id);
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

  /*
    getList() {
  
      //const value = "cur_page=" + 1 + "&per_page=" + 10 + "&distributor_id=" + 110 + "&short=" + 1;
      const dataSend: any = {
        'cur_page': 1,
        'per_page': 10,
        'short': 1
      };
      const dealer_id = 2571677, distributor_id = 0; //TODO get parameter from url
      const ext_data = (dealer_id <= 0) ? `&distributor_id=${distributor_id}` : `&dealer_id=${dealer_id}`;
  
      const urlParams = "cur_page=" + dataSend.cur_page + "&per_page=" + dataSend.per_page + "&short=" + dataSend.short + ext_data;
  
      this.orderAPIService.getOrderList(urlParams).subscribe(data => {
        this.arrOrder = <IOrderList>data.response_data;
        console.log(' this.arrOrder', this.arrOrder);
  
  
        // this.service.arrOrder = this.arrOrder;
      })
    }
  
    */

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
    console.log(this.Form.value.strShipmentStatus);
    
  }

  btnReset() {
    if (this.name === "") {

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

    } else {

      this.Form.get('strOrder').patchValue('')
      this.Form.get('strStatus').patchValue('')
      this.Form.get('strShipmentStatus').patchValue('')
      this.Form.get('daterangepickerModel').patchValue(null)
      this.service.searchTerm = '';
      this.service.searchTerm2 = '';
      this.service.searchTerm3 = '';
      this.service.startDate = (new Date(this.voneMonthAgo)).getTime() / 1000;
      this.service.endDate = (new Date()).getTime() / 1000;
    }
  }

  btnRefresh() {
    this.service.searchTerm = '';
    this.Form.get('strOrder').patchValue('')
  }

  onPageChange(event) {
    this.service.pageSize = event;
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



}