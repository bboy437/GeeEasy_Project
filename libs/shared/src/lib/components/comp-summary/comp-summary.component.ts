import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'project-comp-summary',
  templateUrl: './comp-summary.component.html',
  styleUrls: ['./comp-summary.component.scss']
})
export class CompSummaryComponent implements OnInit {

  @Input() data: any = [] ;
  @Input() status: string;
  constructor() { }

  ngOnInit() {
    console.log(this.data);
    
  }

}
