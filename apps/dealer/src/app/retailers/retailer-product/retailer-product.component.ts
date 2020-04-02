import { Component, OnInit } from "@angular/core";

@Component({
    selector: "project-retailer-product",
    template: `
    <nb-layout>
      <nb-layout-column>
          <router-outlet></router-outlet>
      </nb-layout-column>
    </nb-layout>
  `,
    styleUrls: ["./retailer-product.component.scss"],
})

export class RetailerProductComponent { }