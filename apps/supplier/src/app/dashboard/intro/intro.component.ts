import { Component, OnInit } from "@angular/core";
import { DashboardAPIService } from '@project/services';
import { NbThemeService } from '@nebular/theme';

@Component({
  selector: 'project-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss']
})
export class IntroComponent implements OnInit {


  currentTheme: string;
  themeSubscription: any;
  arrIntro: any = [];
  constructor(private themeService: NbThemeService,
    private dashboardAPIService: DashboardAPIService) {
    this.themeSubscription = this.themeService.getJsTheme().subscribe(theme => {
      this.currentTheme = theme.name

    });
  }

  ngOnInit() {
    this.themeSubscription.unsubscribe();
    this.getIntro();
  }

  getIntro() {
    const value = "cur_page=" + 1 + "&per_page=" + 1;
    this.dashboardAPIService.get("intro", value).subscribe(data => {
      console.log(data.response_data);
      this.arrIntro = data.response_data;

    })
  }
}
