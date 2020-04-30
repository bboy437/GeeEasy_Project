import { Component, OnInit } from "@angular/core";

@Component({
    selector: "project-retailer",
    template: `
    <nb-layout>
      <nb-layout-column style="padding: 0;">
          <router-outlet></router-outlet>
      </nb-layout-column>
    </nb-layout>
  `,
})

export class RetailerComponent { }