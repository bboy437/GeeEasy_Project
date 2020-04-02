import { Input, Output, Component, OnInit } from "@angular/core";

@Component({
  selector: "project-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.scss"]
})
export class TableComponent implements OnInit {
  @Input() table:any;

  constructor() {}

  ngOnInit() {}
}
