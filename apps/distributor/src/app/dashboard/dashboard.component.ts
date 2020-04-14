import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "project-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  data1 = [
    { name: "My Supplier", icon: "people-outline", url: "suppliers/my-suppliers/list"},
    { name: "My Purchase", icon: "browser-outline", url: "purchases/list"},
    { name: "Check In", icon: "checkmark-square-2-outline", url: "check-in/list"}
  ];

  data2 = [
    { name: "My Bills", icon: "pie-chart-outline", url: "bills/list" },
    { name: "Manage Products", icon: "cube-outline", url: "products/manage/list" },
    { name: "My Order", icon: "shuffle-2-outline", url: "orders/list" }
  ];

  date = new Date();
  private UrlRouter_BrowseSupplier = "suppliers/browse-suppliers";
  private UrlRouter_POCreate = "purchases/create";
  private UrlRouter_CrateOrder = "orders/create";
  private UrlRouter_CheckIn = "check-in";
  private UrlRouter_Bills = "bills/list";
  private UrlRouter_CheckStock = "products/list";

  constructor(private router: Router) {}

  ngOnInit() {}

  btnLinkClick(url) {
    this.router.navigate([url]);
  }

  /* btnLinkClick(value: any) {
    if (value === "Browse Suppliers") {
      this.router.navigate([this.UrlRouter_BrowseSupplier]);
    } else if (value === "Create PO.") {
      this.router.navigate([this.UrlRouter_POCreate]);
    } else if (value === "Create Order") {
      this.router.navigate([this.UrlRouter_CrateOrder]);
    } else if (value === "Check-in") {
      this.router.navigate([this.UrlRouter_CheckIn]);
    } else if (value === "Pay bill") {
      this.router.navigate([this.UrlRouter_Bills]);
    } else if (value === "Check Stock") {
      this.router.navigate([this.UrlRouter_CheckStock]);
    }
  } */

  btnLinkClick1(value: any) {
    if (value === "Check-in") {
      this.router.navigate([this.UrlRouter_CheckIn]);
    } else if (value === "Pay bill") {
      this.router.navigate([this.UrlRouter_Bills]);
    } else if (value === "Check Stock") {
      this.router.navigate([this.UrlRouter_CheckStock]);
    }
  }
}
