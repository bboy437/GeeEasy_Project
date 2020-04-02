import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'project-comp-products',
  templateUrl: './comp-products.component.html',
  styleUrls: ['./comp-products.component.scss']
})
export class CompProductsComponent implements OnInit {

  @Input() arrProduct: any = [] ;
  @Input() arrSummary: any = [] ;
  @Input() status: string ;
  @Input() colorSKU: string ;

  constructor() { }

  ngOnInit() {
    
  }

}
