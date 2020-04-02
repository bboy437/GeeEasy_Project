import { Component, OnInit } from "@angular/core";

@Component({
  selector: "project-suppliers",
  template: `
  <nb-layout>
      <nb-layout-column class="padding-0">
          <router-outlet></router-outlet>
      </nb-layout-column>
  </nb-layout>
  `
})
export class DistributorsComponent {}
