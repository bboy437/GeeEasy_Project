import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'project-comp-products-supplier-detail',
  templateUrl: './comp-products-supplier-detail.component.html',
  styleUrls: ['./comp-products-supplier-detail.component.scss']
})
export class CompProductsSupplierDetailComponent implements OnInit {
  @Input() data: string;
  constructor() { }

  ngOnInit() {
  }

}
