import { Component, OnInit } from "@angular/core";

@Component({
  selector: "project-reports-list",
  templateUrl: "./reports-list.component.html",
  styleUrls: ["./reports-list.component.scss"]
})
export class ReportsListComponent implements OnInit {
  users: { name: string; title: string }[] = [
    { name: "Carla Espinosa", title: "Nurse" },
    { name: "Bob Kelso", title: "Doctor of Medicine" },
    { name: "Janitor", title: "Janitor" },
    { name: "Perry Cox", title: "Doctor of Medicine" },
    { name: "Ben Sullivan", title: "Carpenter and photographer" }
  ];

  constructor() {}

  ngOnInit() {}
}
