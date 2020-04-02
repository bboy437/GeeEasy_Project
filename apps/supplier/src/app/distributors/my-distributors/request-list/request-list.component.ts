import { Component, OnInit, ViewChildren, QueryList } from "@angular/core";
import {
  DistributorAPIService,
  NgbdSortableHeader,
  SortEvent
} from "@project/services";
import { ActivatedRoute, Router } from "@angular/router";
import { NbDialogService } from "@nebular/theme";
import { DialogsRequestComponent } from "../../../dialogs/dialogs-request/dialogs-request.component";
import { IRequest } from "@project/interfaces";
import { Observable } from "rxjs";
import { TableService } from "./table-list.service";
import { DecimalPipe } from '@angular/common';

@Component({
  selector: "project-request-list",
  templateUrl: "./request-list.component.html",
  styleUrls: ["./request-list.component.scss"],
  providers: [TableService, DecimalPipe]
})
export class RequestListComponent implements OnInit {
  private UrlRouter_Detail = "distributors/request/detail";
  arrRequest: any = [];
  strname: string;
  strStatus: string;
  arrRequestList$: Observable<IRequest[]>;
  totalList$: Observable<number>;
  loading = false;
  isReload = false;
  id_local: string;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(
    private distributorAPIService: DistributorAPIService,
    private dialogService: NbDialogService,
    public service: TableService,
    private router: Router,
  ) {
    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);
    this.loading = true;
  }

  onSort({ column, direction }: SortEvent) {
    console.log({ column, direction });

    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = "";
      }
    });
    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  ngOnInit() {
    this.getRequestList();
    this.callApi(e => {
      // completed
    });
  }

  callApi(callback) {
    this.service.getData(e => {
      this.arrRequestList$ = this.service.countries$;
      this.totalList$ = this.service.total$;
      this.loading = false;
      callback(true);
    });
  }

  btnReload() {

    this.isReload = true;
    this.service.getData(e => {
      this.arrRequestList$ = this.service.countries$;
      this.totalList$ = this.service.total$;
      this.isReload = false;
    });
  }

  btnRefresh() {
    this.service.searchTerm = "";
    this.strname = ""
  }

  getRequestList() {
    const value =
      "cur_page=" + 1 + "&per_page=" + 20 + "&supplier_id=" + this.id_local;
    this.distributorAPIService.getRequestList(value).subscribe(data => {
      this.arrRequest = <IRequest>data.response_data;
      console.log(data);
      this.arrRequest.forEach(element => {
        element.distributor_name =
          element.distributor_data_array[0].distributor_name;
      });
    });
  }

  btnRequest(data) {
    this.dialogService.open(DialogsRequestComponent, {
      context: {
        data: data
      }
    });
  }

  btnRowClick(row: any) {
    console.log('row', row);

    this.router.navigate([this.UrlRouter_Detail, row]);
  }


  btnReset() {
    this.service.searchTerm1 = "";
    this.service.searchTerm = "";
    this.strStatus = "";
    this.strname = "";
  }

  filterPoNo(value) {
    this.service.searchTerm = value;
  }

  filterStatus(event: any) {
    this.service.searchTerm1 = this.strStatus;
  }

  btnFilter() {
    if (
      this.strStatus === undefined ||
      this.strStatus === "" ||
      this.strStatus === null
    ) {
      this.service.searchTerm1 = "";
    } else {
      this.service.searchTerm1 = this.strStatus;
    }

    if (
      this.strname === undefined ||
      this.strname === "" ||
      this.strname === null
    ) {
      this.service.searchTerm = "";
    } else {
      this.service.searchTerm = this.strname;
    }
  }

  openUrl(url: string) {
    window.open(url, "_blank");
  }
}
