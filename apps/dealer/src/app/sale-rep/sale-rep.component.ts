import { Component, OnInit } from "@angular/core";

@Component({
  selector: "project-sale-rep",
  template: `
    <nb-layout>
      <nb-layout-column style="padding: 0;">
          <router-outlet></router-outlet>
      </nb-layout-column>
    </nb-layout>
  `,
  styleUrls: ["./sale-rep.component.scss"],
})



export class SaleRepComponent {}
