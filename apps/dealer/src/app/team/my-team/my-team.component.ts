import { Component, OnInit } from "@angular/core";

@Component({
  selector: "project-my-team",
  template: `
    <nb-layout>
      <nb-layout-column style="padding: 0;">
        <router-outlet></router-outlet>
      </nb-layout-column>
    </nb-layout>
`
})
export class MyTeamComponent implements OnInit {
  
  ngOnInit() { }
}
