
import { BrowseSupplierAPIService, SupplierAPIService } from '@project/services';
import { Router, ActivatedRoute } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'project-browse-suppliers',
  templateUrl: './browse-suppliers.component.html',
  styleUrls: ['./browse-suppliers.component.scss']
})

export class BrowseSuppliersComponent implements OnInit {
  isButton: string;
  strproduct: string;
  strname: string;
  strStatus: string;
  strCategory: string;
  strMap: string;
  loading = false;

  constructor(
    private route: ActivatedRoute,
  ) {

  }


  ngOnInit() {
    this.isButton = "product";
    this.strproduct = this.route.snapshot.queryParamMap.get('filterByProduct')
    this.strname = this.route.snapshot.queryParamMap.get('filterByName')
    this.strCategory = this.route.snapshot.queryParamMap.get('filterByCategory')
    this.strMap = this.route.snapshot.queryParamMap.get('filterByMap')
    this.strStatus = this.route.snapshot.queryParamMap.get('status')
    if (this.strStatus === "product") {
      this.isButton = "product";
    }
    if (this.strStatus === "name") {
      this.isButton = "name";
    }
    if (this.strStatus === "category") {
      this.isButton = "category";
    }
    if (this.strStatus === "map") {
      this.isButton = "location";
    }

  }

  clickButton(data: string) {
    this.isButton = data;
  }

}
