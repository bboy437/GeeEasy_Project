import { Router, ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { NbDialogService } from "@nebular/theme";

@Component({
  selector: "project-browse-distributors-list",
  templateUrl: "./browse-distributors-list.component.html",
  styleUrls: ["./browse-distributors-list.component.scss"]
})
export class BrowseDistributorsListComponent implements OnInit {

  isButton: string;
  strproduct: string;
  strname: string;
  strStatus: string;
  strCategory: string;
  strMap: string;
  strsubCate = '';
  loading = false;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.isButton = "product";
    this.strproduct = this.route.snapshot.queryParamMap.get("filterByProduct");
    this.strname = this.route.snapshot.queryParamMap.get("filterByName");
    this.strMap = this.route.snapshot.queryParamMap.get("filterByMap");
    this.strCategory = this.route.snapshot.queryParamMap.get(
      "filterByCategory"
    );
    this.strStatus = this.route.snapshot.queryParamMap.get("status");
    if (this.strStatus === "product") {
      this.isButton = "product";
    }
    if (this.strStatus === "name") {
      this.isButton = "name";
    }
    if (this.strStatus === "category") {
      this.isButton = "category";
    }
    if (this.strStatus === "map") {
      this.isButton = "location";

    }
  }

  clickButton(data: string) {
    this.isButton = data;
  }


}
