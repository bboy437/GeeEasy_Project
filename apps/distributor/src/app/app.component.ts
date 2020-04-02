import { Component } from "@angular/core";
import { MENU_ITEMS } from "./menu";

@Component({
  selector: "project-root",
  styleUrls: ["app.component.scss"],
  template: `
    <project-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </project-column-layout>
  `
})
export class AppComponent {
  menu = MENU_ITEMS;
  
}
