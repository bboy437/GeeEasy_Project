import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupplierAPIService } from '@project/services';

@Component({
  selector: 'project-my-suppliers',
  template: `
  <nb-layout>
    <nb-layout-column style="padding:0rem">
        <div class="pages suppliers-my-suppliers-list">
            <div class="row">
                <div class="col-12 col-md-12 col-lg-12 col-xl-12">
                    <nb-card>
                        <nb-card-header>
                            <div class="header">
                                <nb-icon icon="people-outline"></nb-icon>
                                <label>My Supplier</label>
                            </div>
                        </nb-card-header>
                    </nb-card>
                </div>
                <div class="col-12 col-md-12 col-lg-12 col-xl-12">
                    <nb-card>
                        <nb-card-body>
                            <nb-route-tabset [tabs]="tabs">
                                <router-outlet></router-outlet>
                            </nb-route-tabset>
                        </nb-card-body>
                    </nb-card>
                </div>
                <div class="col-12 col-md-12 col-lg-12 col-xl-12">
                    <project-footercomponent> </project-footercomponent>
                </div>
            </div>
        </div>
    </nb-layout-column>
</nb-layout>
`
})
export class MySuppliersComponent implements OnInit {

  tabs: any[] 

  constructor(
    private supplierAPIService: SupplierAPIService,
    private router: Router,
  ) { }

  private UrlRouter_SupplierSave = "suppliers/mysupplier-save";


  ngOnInit() {
    this.tabs = [
      {
        title: "Request",
        route: "/suppliers/my-suppliers/request/list"
      },
      {
        title: 'My Suppliers',
        route: ['/suppliers/my-suppliers/list'],
        responsive: true,
      },
      {
        title: 'Verified Supplier',
        route: ['/suppliers/my-suppliers/verifed/list'],
        responsive: true,
      },
      {
        title: 'Favorite',
        route: ['/suppliers/my-suppliers/favorite/list'],
        responsive: true,
      },
      {
        title: 'Invite Outsource Supplier',
        responsive: true,
        disabled: true,
      },

    ];
  }



}

