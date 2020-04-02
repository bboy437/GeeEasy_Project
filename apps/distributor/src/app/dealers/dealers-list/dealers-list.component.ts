import { Component, OnInit, QueryList, ViewChildren } from "@angular/core";
import { DealersTableService } from "./table-list.service";
import { DecimalPipe } from "@angular/common";
import { IDealer } from "@project/interfaces";
import { NgbdSortableHeader, SortEvent } from "@project/services";
import { Observable } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: "project-dealers-list",
  templateUrl: "./dealers-list.component.html",
  styleUrls: ["./dealers-list.component.scss"],
  providers: [DealersTableService, DecimalPipe]
})
export class DealersListComponent implements OnInit {
  dealerslist$: Observable<IDealer[]>;
  tatallist$: Observable<number>;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  private UrlRouter_DealersSave = "dealers/save";
  private UrlRouter_DealersDetail = "dealers/detail";
  private UrlRouter_DealersOrderDealer = "orders/list";
  loading = false;
  isReload = false;

  constructor(private router: Router, public service: DealersTableService) {
    this.loading = true;
  }

  onSort({ column, direction }: SortEvent) {
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = "";
      }
    });
    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  ngOnInit() {
    // this.getProductGroup();
    this.callApi(e => {
      // completed
    });
  }

  callApi(callback) {
    this.service.getData(e => {
      this.dealerslist$ = this.service.countries$;
      this.tatallist$ = this.service.total$;
      this.loading = false;
      callback(true);
    });
  }

  btnReload() {

    this.isReload = true;
    this.service.getData(e => {
      this.dealerslist$ = this.service.countries$;
      this.tatallist$ = this.service.total$;
      this.isReload = false;
    });
  }

  
  btnNewClick(){
    this.router.navigate([this.UrlRouter_DealersSave, 'new']);
  }

  btnRowClick(row: any){
    this.router.navigate([this.UrlRouter_DealersDetail, row]);
  }

  btnViewClick(row: any){
    console.log(row);
    
    this.router.navigate([this.UrlRouter_DealersOrderDealer, { id: row.dealer_name }] );
  }


  filter(value:any){
    this.service.searchTerm = value;
  } 

  btnRefresh(){
    this.service.searchTerm = '';
  }

}
