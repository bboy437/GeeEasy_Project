import { Component, OnInit, Input, QueryList, ViewChildren, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MysupplierTableService } from '../table-list.service';
import { NgbdSortableHeader } from '@project/services';
import { Observable } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { IVerifed } from '@project/interfaces';
import { SupplierAPIService } from '@project/services';


@Component({
  selector: 'project-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [MysupplierTableService, DecimalPipe]
})
export class ListComponent implements OnInit {
  @Input() strStatus: string;
  @Input() strID: string;
  @Output() supplier = new EventEmitter<any>();
  loading = false;
  isReload = false;
  arrSupplier: any = [];
  arrSuppliers: any = [];
  isCheckData: string;
  mySuplierList$: Observable<IVerifed[]>;
  totalList$: Observable<number>;
  strFilter: string;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(
    private supplierAPIService: SupplierAPIService,
    public service: MysupplierTableService,
  ) {
    this.loading = true;
  }



  ngOnInit() {
    // this.getProductGroup();
    this.callApi(e => {
      // completed
    });
  }

  callApi(callback) {
    this.service.getData(e => {
      this.mySuplierList$ = this.service.countries$;
      this.totalList$ = this.service.total$;
      this.loading = false;
      callback(true);
    });
  }

  btnReload() {

    this.isReload = true;
    this.service.getData(e => {
      this.mySuplierList$ = this.service.countries$;
      this.totalList$ = this.service.total$;
      this.isReload = false;
    });
  }


  // getSupplier() {
  //   const value = "cur_page=" + 1 + "&per_page=" + 100 + "&distributor_id=" + 110
  //   this.supplierAPIService.getSupListCreate(value).subscribe(data => {
  //     this.arrSupplier = <IVerifed>data.response_data;
  //     this.btnClickItem(this.arrSupplier[0])
  //     console.log(this.arrSupplier);
  //   })
  // }


  btnClickItem(id, name) {
    const data = {
      id: id,
      name:name
    }
    this.supplier.emit(data)
    this.loading = false;

  }


  filter(value: any) {
    this.service.searchTerm = value;
  }

  btnRefresh(){
    this.service.searchTerm = '';
    this.strFilter = '';
  }




}
