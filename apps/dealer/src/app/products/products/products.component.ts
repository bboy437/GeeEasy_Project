import { Component, OnInit } from "@angular/core";

@Component({
  selector: "project-products",
  template: `
    <nb-layout>
      <nb-layout-column style="padding: 0;">
          <router-outlet></router-outlet>
      </nb-layout-column>
    </nb-layout>
  `,
  styleUrls: ["./products.component.scss"],
})

export class ProductsComponent { }