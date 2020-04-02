import { Component, OnInit } from "@angular/core";

@Component({
    selector: "project-retailer",
    template: `
    <nb-layout>
      <nb-layout-column>
          <router-outlet></router-outlet>
      </nb-layout-column>
    </nb-layout>
  `,
    styleUrls: ["./retailer.component.scss"],
})

export class RetailerComponent { }