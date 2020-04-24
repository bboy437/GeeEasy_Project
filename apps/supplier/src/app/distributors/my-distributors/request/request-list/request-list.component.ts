import { Component, OnInit, ViewChildren, QueryList } from "@angular/core";
import {
  DistributorAPIService,
  NgbdSortableHeader,
  SortEvent,
  RequestService
} from "@project/services";
import { ActivatedRoute, Router } from "@angular/router";
import { NbDialogService } from "@nebular/theme";
import { DialogsReplyRequestComponent } from "../../../../dialogs/dialogs-reply-request/dialogs-reply-request.component";
import { IRequest } from "@project/interfaces";
import { Observable } from "rxjs";
import { TableService } from "./table-list.service";
import { DecimalPipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: "project-request-list",
  templateUrl: "./request-list.component.html",
  styleUrls: ["./request-list.component.scss"],
  providers: [TableService, DecimalPipe]
})
export class RequestListComponent implements OnInit {
  private UrlRouter_Detail = "distributors/request/detail";
  arrRequestList$: Observable<IRequest[]>;
  totalList$: Observable<number>;
  isReload = false;
  id_local: string;
  Form: FormGroup;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(
    private distributorAPIService: DistributorAPIService,
    private requestService: RequestService,
    private dialogService: NbDialogService,
    public service: TableService,
    private router: Router,
    private formBuilder: FormBuilder,
  ) {
    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);

    this.arrRequestList$ = this.service.countries$;
    this.totalList$ = this.service.total$;
    this.service.loading$.subscribe(res => {
      this.isReload = res
      console.log(res)
    })

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
    this.Form = this.formBuilder.group({
      strname: [],
      strStatus: [],
    });
  }


  btnReload() {
    this.service.searchTerm1 = "";
    this.service.searchTerm = "";
    this.Form.value.strStatus = "";
    this.Form.value.strname = "";

    // this.requestService.requestList$.subscribe(res => {
    //   console.log(res)
    // })

  }

  btnRefresh() {
    this.service.searchTerm = "";
    this.Form.value.strname = ""
  }


  btnReply(data) {
    this.dialogService.open(DialogsReplyRequestComponent, {
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
    this.Form.value.strStatus = "";
    this.Form.value.strname = "";
  }

  filterPoNo(value) {
    this.service.searchTerm = value;
  }

  filterStatus(event: any) {
    this.service.searchTerm1 = this.Form.value.strStatus;
  }


  openUrl(url: string) {
    window.open(url, "_blank");
  }

}
