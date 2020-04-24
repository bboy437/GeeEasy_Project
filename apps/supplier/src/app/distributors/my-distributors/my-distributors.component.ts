import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "project-my-distributors",
  template: `
  <nb-layout>
    <nb-layout-column class="padding-0">
        <div class="cover-pages">
            <div class="row">
                <div class="col-12 col-md-12 col-lg-12 col-xl-12">
                    <nb-card>
                        <nb-card-header>
                            <div class="cover-header header">
                                <nb-icon icon="people-outline"></nb-icon>
                                <label>My Distributor</label>
                            </div>
                        </nb-card-header>
                    </nb-card>
                </div>
                <div class="col-12 col-md-12 col-lg-12 col-xl-12">
                    <nb-card>
                        <nb-card-body style="padding: 1rem;">
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
export class MyDistributorsComponent implements OnInit {
  tabs: any[] = [
    {
      title: "Request",
      route: "/distributors/my-distributor/request/list"
    },
    {
      title: "My Distributor",

      route: "/distributors/my-distributor/list"
    },
    {
      title: "Verified Distributor",
      route: "/distributors/my-distributor/veriferd/list"
    },
    {
      title: "Favorite",
      route: "/distributors/my-distributor/favorite/list"
    },
    {
      title: "Invite Outsource Distributor",
      disabled: true
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {}
}
