import { Component, OnInit } from "@angular/core";

@Component({
  selector: "project-bills",
  template: `
  <nb-layout>
      <nb-layout-column style="padding: 0rem;">
          <router-outlet></router-outlet>
      </nb-layout-column>
  </nb-layout>
  `
})
export class BillsComponent {}
