import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'project-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss']
})
export class OrderSummaryComponent implements OnInit {

  @Input() data: any = [] ;
  private UrlRouter_CheckIn = "checkins/checkin";
  constructor(
    private router: Router
  ) { }

  
  ngOnInit() {
  }

  btnCheckIn(){
    this.router.navigate([this.UrlRouter_CheckIn, { id: 1 }]);
  }

}
