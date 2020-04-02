import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "project-my-distributors",
  templateUrl: "./my-distributors.component.html",
  styleUrls: ["./my-distributors.component.scss"]
})
export class MyDistributorsComponent implements OnInit {
  tabs: any[] = [
    {
      title: "Request",
      route: "/distributors/my-distributor/request/list"
    },
    {
      title: "My Distributor",

      route: "/distributors/my-distributor/list"
    },
    {
      title: "Verified Distributor",
      route: "/distributors/my-distributor/veriferd/list"
    },
    {
      title: "Favorite",
      route: "/distributors/my-distributor/favorite/list"
    },
    {
      title: "Invite Outsource Distributor",
      disabled: true
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {}
}
