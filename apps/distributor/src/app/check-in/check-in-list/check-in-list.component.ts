import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { NgbdSortableHeader, SortEvent } from '@project/services';
import { Icheckin } from '@project/interfaces';
import { CheckInTableService } from './checkintable.service';
import { CheckinAPIService } from '@project/services';
import { NbDialogService } from '@nebular/theme';
import { DialogsCheckinStatusComponent } from '../../dialogs/dialogs-checkin-status/dialogs-checkin-status.component';

@Component({
  selector: 'project-check-in-list',
  templateUrl: './check-in-list.component.html',
  styleUrls: ['./check-in-list.component.scss'],
  providers: [CheckInTableService, DecimalPipe]
})
export class CheckInListComponent implements OnInit {

  DateSelected = new Date();
  arrCheckIn$: Observable<Icheckin[]>;
  total$: Observable<number>;
  private UrlRouter_CheckInDetail = "check-in/detail";
  private UrlRouter_CheckInSave = "check-in/save";
  private UrlRouter_PurchaseDetail = "purchases/detail";
  strFillter: string;
  arrCheckIn: any = [];
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  loading = false;
  isReload = false;

  constructor(
    public service: CheckInTableService,
    private router: Router,
    private checkinAPIService: CheckinAPIService,
    private dialogService: NbDialogService, ) {

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

    this.callApi(e => {
      // completed
    });

  }

  callApi(callback) {
    this.service.refresh(e => {
      this.arrCheckIn$ = this.service.countries$;
      this.total$ = this.service.total$;
      this.loading = false;
      callback(true);
    });
  }

  btnReload() {
    this.isReload = true;
    this.service.refresh(e => {
      this.isReload = false;
    });
  }


  // btnRowClick(row: any): void {
  //   this.router.navigate([this.UrlRouter_CheckInDetail, row]);
  //   // this.checkinAPIService.clickDataCheckIn(data);

  // }

  filter(value: any) {
    this.service.searchTerm = value;
  }

  btnRefresh(){
    this.strFillter = "";
    this.service.searchTerm = "";
  }


  checkIn(row: any, data) {
    console.log(data.checkin_data_array[0].checkin_qty_done);
    
 
    const dialogRef = this.dialogService.open(DialogsCheckinStatusComponent, {
      context:{
        data: data.checkin_data_array[0].checkin_qty_done
      }
    });
    dialogRef.onClose.subscribe(result => {
      // tslint:disable-next-line: triple-equals
      if (result == "0") {
        this.router.navigate([this.UrlRouter_CheckInDetail, row, result]);
      }
      // tslint:disable-next-line: triple-equals
      if (result == "1") {
        this.router.navigate([this.UrlRouter_CheckInDetail, row, result]);
      }
    });
  }

  btnRowClick(row: any) {
    this.router.navigate([this.UrlRouter_PurchaseDetail , "check-in", row]);
  }

}
