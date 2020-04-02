import { Component, OnInit } from "@angular/core";

@Component({
  selector: "project-reports",
  template:   `
  <nb-layout>
      <nb-layout-column>
         <router-outlet></router-outlet>
      </nb-layout-column>
  </nb-layout>
  `
})
export class ReportsComponent {}
