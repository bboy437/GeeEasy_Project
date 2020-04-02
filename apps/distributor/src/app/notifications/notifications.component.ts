import { Component, OnInit } from "@angular/core";

@Component({
  selector: "project-notifications",
  template: `
    <nb-layout>
      <nb-layout-column style="padding: 0;">
        <router-outlet></router-outlet>
        <div class="col-12 col-md-12 col-lg-12 col-xl-12">
          <project-footercomponent> </project-footercomponent>
        </div>
      </nb-layout-column>
    </nb-layout>
  `
})
export class NotificationsComponent {}
