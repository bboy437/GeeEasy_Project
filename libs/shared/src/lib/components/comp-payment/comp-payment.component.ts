import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'project-comp-payment',
  templateUrl: './comp-payment.component.html',
  styleUrls: ['./comp-payment.component.scss']
})
export class CompPaymentComponent implements OnInit {
  @Output() categoryID = new EventEmitter<any>();
  @Input() data: any;
  @Input() payment_total: number;
  @Input() over: number;

  overTHB: number;
  loading = false;
  product_currency_code: string;
  constructor(
  ) { }

  ngOnInit() {
    console.log(this.data);

    this.overTHB = this.over >= 0 ? 0 : Math.abs(this.over);
    this.product_currency_code = this.data.length === 0 ? "THB" : this.data[0].product_currency_code;

  }


}