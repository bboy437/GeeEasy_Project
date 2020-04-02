import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'project-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.scss']
})


export class ManageProductsComponent implements OnInit {
  tabs = [
    {
      title: 'My Products',
      route: ['/products/manager-products/order'],
      responsive: true,
    }
    /*, {
      title: 'PO Products',
      route: ['/products/manager-products/po'],
      responsive: true,
      disabled: true,
    } */
  ];

  constructor(
    private router: Router ) {
  }

  ngOnInit() {
  }

  btnRowClick(row: any): void {
    this.router.navigate(['products']);
  }

  _router() {
    let _self_ = this;
    let _function = {
      getSelf(callback : (res) => any) {
        let _self = this;
        callback(_self);
      },
      consoleLog(_function_,_title_,_data_) {
        let _self = this;
        console.log(_function_," : ",_title_ ," : ",_data_);
      },
      navigate(url,value,callback : (res) => any) {
        let _self = this;
        _self.consoleLog("navigate","url",url);
        _self.consoleLog("navigate","value",value);
        _self_.router.navigate([url,value]);
        callback(true);
      },
      newProducts() {
        let _self = this ,pageUrl = "products/products/create/";
        _self.consoleLog("newProducts","pageUrl",pageUrl);
        _self.navigate(pageUrl,"new",navigateByUrl => {
          _self.consoleLog("newProducts","navigateByUrl",navigateByUrl);
        });
      }
    }
    return _function
  };
}
