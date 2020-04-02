import { Component, OnInit } from '@angular/core';
import { DashboardAPIService } from '@project/services';

@Component({
  selector: 'project-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  arrblog: any = [];
  constructor(
    private dashboardAPIService: DashboardAPIService
  ) { }

  ngOnInit() {
    this.getIntro();
  }
  getIntro() {
    const value = "cur_page=" + 1 + "&per_page=" + 2;
    this.dashboardAPIService.get("blog", value).subscribe(data => {
      console.log(data.response_data);
      this.arrblog = data.response_data;
    })
  }
}
