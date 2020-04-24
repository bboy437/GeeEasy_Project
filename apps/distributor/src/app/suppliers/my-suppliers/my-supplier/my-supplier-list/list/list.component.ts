import { Component, OnInit, Input, QueryList, ViewChildren, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MysupplierTableService } from '../table-list.service';
import { NgbdSortableHeader } from '@project/services';
import { Observable } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { ISupplier } from '@project/interfaces';
import { SupplierAPIService } from '@project/services';


@Component({
  selector: 'project-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [MysupplierTableService, DecimalPipe]
})
export class ListComponent implements OnInit {
  @Input() strStatus: string;
  @Output() supplier = new EventEmitter<any>();
  loading = false;
  isReload = false;
  arrSupplier: any = [];
  arrSuppliers: any = [];
  isCheckData: string;
  mySuplierList$: Observable<ISupplier[]>;
  totalList$: Observable<number>;
  strFilter: string;
  strID: number;

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
      this.supplierAPIService.categoryIDSelectedAction$.subscribe(res => {
        if (res) {
          this.strID = res;
          // this.supplierAPIService.selectedCategorySupplier(res);
        }
      })
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
    this.supplierAPIService.selectedCategorySupplier(null);
    this.isReload = true;
    this.service.getData(e => {
      this.mySuplierList$ = this.service.countries$;
      this.totalList$ = this.service.total$;
      this.isReload = false;
    });
  }



  btnClickItem(id, name) {
    const data = {
      id: id,
      name: name
    }
    this.supplier.emit(data)
    this.loading = false;

  }


  filter(value: any) {
    this.service.searchTerm = value;
  }

  btnRefresh() {
    this.service.searchTerm = '';
    this.strFilter = '';
  }




}
