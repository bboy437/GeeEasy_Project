import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'project-manage-products',
  template: `
  <nb-layout>
    <nb-layout-column style="padding: 0;">
        <div class="pages">
            <div class="row">
                <div class="col-12">
                    <nb-card>
                        <nb-card-header>
                            <div class="header">
                                <div class="row">
                                    <div class="col-auto mr-auto">
                                        <nb-icon class="icon-header" icon="cube-outline"></nb-icon>
                                        <label>Manager Products</label>
                                    </div>
                                    <div class="col-auto">
                                        <button nbButton size="medium" status="primary" (click)="_router().newProducts()">
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
  tabs = [
    {
      title: 'My Products',
      route: ['/products/manager-products/order'],
      responsive: true,
    }
    /*, {
      title: 'PO Products',
      route: ['/products/manager-products/po'],
      responsive: true,
      disabled: true,
    } */
  ];

  constructor(
    private router: Router) {
  }

  ngOnInit() {
  }

  btnRowClick(row: any): void {
    this.router.navigate(['products']);
  }

  _router() {
    let _self_ = this;
    let _function = {
      getSelf(callback: (res) => any) {
        let _self = this;
        callback(_self);
      },
      consoleLog(_function_, _title_, _data_) {
        let _self = this;
        console.log(_function_, " : ", _title_, " : ", _data_);
      },
      navigate(url, value, callback: (res) => any) {
        let _self = this;
        _self.consoleLog("navigate", "url", url);
        _self.consoleLog("navigate", "value", value);
        _self_.router.navigate([url, value]);
        callback(true);
      },
      newProducts() {
        let _self = this, pageUrl = "products/products/create/";
        _self.consoleLog("newProducts", "pageUrl", pageUrl);
        _self.navigate(pageUrl, "new", navigateByUrl => {
          _self.consoleLog("newProducts", "navigateByUrl", navigateByUrl);
        });
      }
    }
    return _function
  };
}
