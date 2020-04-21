import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';

@Component({
  selector: "project-stock",
  template: `
  <nb-layout>
    <nb-layout-column style="padding:0rem">
        <div class="pages suppliers-my-suppliers-list">
            <div class="row">
                <div class="col-12 col-md-12 col-lg-12 col-xl-12">
                <nb-card>
                   <nb-card-header>
                    <div class="header">
                        <div class="row">
                            <div class="col-auto mr-auto">
                                <nb-icon icon="cube-outline"></nb-icon>
                                <label>Manage Products</label>
                            </div>
                            <div class="col-auto">
                                <button nbButton size="medium" status="primary" (click)="btnNewClick()">
                                    New Product
                                </button>
                            </div>
                        </div>
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
export class ManageProductsComponent implements OnInit {

  private UrlRouter_ProductCreate = "products/manage/create";
  tabs: any[]

  constructor(
    private router: Router,
  ) { }


  btnNewClick(): void {
    this.router.navigate([this.UrlRouter_ProductCreate, "new"]);
  }


  ngOnInit() {
    this.tabs = [
      {
        title: "My Products",
        route: ['/products/manage/list'],
        responsive: true,
      },
      {
        title: 'Favorite',
        route: ['/products/manage/favorite'],
        responsive: true,
      },
    ];
  }



}

