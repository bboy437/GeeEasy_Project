import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SupplierAPIService } from "@project/services";

@Component({
  selector: "project-accounts",
  template: `
<nb-layout>
<nb-layout-column style="padding:0rem">
    <div class="pages account-delivery-information">
      <div class="row">
        <div class="col-12 col-md-12 col-lg-12 col-xl-12">
            <nb-card>
                <nb-card-header>
                    <div class="header">
                        <nb-icon class="icon-header" icon="person-done-outline"></nb-icon>
                        <label>My Information</label>
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
        <div class="col-12 col-md-12 col-lg-12 col-xl-12" >
            <project-footercomponent> </project-footercomponent>
        </div>
     </div>
  </div>
</nb-layout-column>
</nb-layout>
`
})
export class AccountsComponent implements OnInit {
  tabs: any[] = [
    {
      title: "Delivery Information",
      route: ["/account/delivery-information/list"],
      icon: "person-outline",
      responsive: true
    } ,
    {
      title: "Info",
      route: ["/account/info/list"],
      icon: "person-outline",
      responsive: true
    },
     /* 
    {
      title: 'Delivery Information',
      route: ['/account/delivery-information/list'],
      responsive: true,
    },
    {
      title: 'Delivery Information',
      route: ['/account/delivery-information/list'],
      responsive: true,
    }
    */
    /**
     * backup
     */
  ];

  constructor(
    private supplierAPIService: SupplierAPIService,
    private router: Router
  ) { }

  ngOnInit() { }
}
