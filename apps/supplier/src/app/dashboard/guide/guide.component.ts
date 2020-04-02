import { Component, OnInit } from "@angular/core";
import { DashboardAPIService } from '@project/services';

@Component({
  selector: "project-guide",
  templateUrl: "./guide.component.html",
  styleUrls: ["./guide.component.scss"]
})
export class GuideComponent implements OnInit {

  arrGuide: any = [];
  constructor(
    private dashboardAPIService: DashboardAPIService
  ) { }

  ngOnInit() {
    this.getGuide();
  }

  getGuide() {
    const value = "cur_page=" + 1 + "&per_page=" + 10;
    this.dashboardAPIService.get("guide", value).subscribe(data => {
      console.log(data.response_data);
      this.arrGuide = data.response_data;

    })
  }
}
