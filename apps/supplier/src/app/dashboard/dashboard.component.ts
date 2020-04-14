import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "project-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  data = [
    {
      name: "My Distributor",
      icon: "people-outline",
      url: "distributors/my-distributor/list",
      value: 1
    },
    {
      name: "My Purchase",
      icon: "browser-outline",
      url: "purchases/list",
      value: 2
    },
    {
      name: "My Bills",
      icon: "pie-chart-outline",
      url: "bills/list",
      value: 3
    },
    {
      name: "Manage Product",
      icon: "cube-outline",
      url: "products/manage/list",
      value: 4
    },
    {
      name: "My Messages",
      icon: "message-circle-outline",
      url: "messages/list",
      value: 5
    },
    {
      name: "Notification",
      icon: "radio-outline",
      url: "notifications/list",
      value: 6
    }
  ];

  date = new Date();
  private UrlRouter_PurchaseList = "purchases/list";

  constructor(private router: Router) { }

  ngOnInit() { }

  btnClick(url) {
    this.router.navigate([url]);
  }
}
